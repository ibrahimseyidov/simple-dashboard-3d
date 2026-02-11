import React, { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { Color } from "three";
import { useDesignersStore } from "../store/designersStore";
import { useObjectsStore } from "../store/objectsStore";
import { Select } from "../shared/components/Select";
import { Toolbar } from "../shared/components/Toolbar";
import { Button } from "../shared/components/Button";
import { ColorPicker } from "../shared/components/ColorPicker";
import { sizeToScale } from "../shared/utils/sizeMapping";
import { SceneObject } from "../api/types";

type SizeOption = "small" | "normal" | "large";

const sizeOptions: { value: SizeOption; label: string }[] = [
  { value: "small", label: "Small" },
  { value: "normal", label: "Normal" },
  { value: "large", label: "Large" }
];

function formatDesignerLabel(fullName: string, workingHours: string) {
  return `${fullName} (${workingHours})`;
}

export const EditorPage: React.FC = () => {
  const {
    designers,
    fetchDesigners,
    selectedDesignerId,
    setSelectedDesignerId
  } = useDesignersStore();
  const {
    objects,
    fetchObjects,
    createObject,
    updateObject,
    selectedObjectId,
    setSelectedObjectId,
    hoveredObjectId,
    setHoveredObjectId,
    error: objectsError
  } = useObjectsStore();

  const [canvasError, setCanvasError] = useState<string | null>(null);

  useEffect(() => {
    if (designers.length === 0) {
      void fetchDesigners();
    }
    if (objects.length === 0) {
      void fetchObjects();
    }
  }, [designers.length, objects.length, fetchDesigners, fetchObjects]);

  const designerOptions = useMemo(
    () =>
      designers.map((d) => ({
        value: d.id,
        label: formatDesignerLabel(d.fullName, d.workingHours)
      })),
    [designers]
  );

  const selectedObject: SceneObject | undefined = useMemo(
    () => objects.find((o) => o.id === selectedObjectId),
    [objects, selectedObjectId]
  );

  const handleGroundDoubleClick = (point: { x: number; y: number; z: number }) => {
    if (!selectedDesignerId) {
      setCanvasError("Select a designer before adding objects.");
      setTimeout(() => setCanvasError(null), 3200);
      return;
    }

    void createObject({
      name: `Object ${objects.length + 1}`,
      designerId: selectedDesignerId,
      color: "#22c55e",
      size: "normal",
      position: { x: point.x, y: point.y, z: point.z }
    });
  };

  const handlePropertyChange = async (
    patch: Partial<Omit<SceneObject, "id">>
  ): Promise<void> => {
    if (!selectedObject) return;
    await updateObject(selectedObject.id, patch);
  };

  return (
    <div className="page">
      <div className="editor-layout">
        <div className="editor-layout__canvas">
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "0.75rem 0.9rem 0.5rem" }}>
              <Toolbar
                left={
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                      3D Editor
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af"
                      }}
                    >
                      Double‑click the ground to add objects
                    </div>
                  </div>
                }
                right={
                  <Select
                    style={{ minWidth: 220 }}
                    label="Current designer"
                    value={selectedDesignerId ?? ""}
                    onChange={(e) =>
                      setSelectedDesignerId(e.target.value || undefined)
                    }
                    options={designerOptions}
                    allowEmptyOption
                    emptyLabel="None selected"
                  />
                }
              />
              {objectsError && (
                <div
                  className="message message--error"
                  style={{ marginTop: "0.35rem" }}
                >
                  {objectsError}
                </div>
              )}
            </div>
            <div className="canvas-container">
              <div className="canvas-overlay">
                {canvasError && (
                  <div className="message message--error canvas-error">
                    {canvasError}
                  </div>
                )}
                <div className="canvas-overlay__hint">
                  • Double‑click ground to create box
                  <br />
                  • Click box to select, drag gizmo to move
                </div>
              </div>
              <Canvas
                shadows
                camera={{ position: [6, 6, 10], fov: 50 }}
              >
                <Scene
                  objects={objects}
                  selectedObjectId={selectedObjectId}
                  hoveredObjectId={hoveredObjectId}
                  onSelectObject={setSelectedObjectId}
                  onHoverObject={setHoveredObjectId}
                  onGroundDoubleClick={handleGroundDoubleClick}
                  onUpdateObjectPosition={(id, position) =>
                    updateObject(id, { position })
                  }
                />
              </Canvas>
            </div>
          </div>
        </div>

        <div className="editor-layout__properties">
          <div className="card card--right-pane">
            <ObjectPropertiesPanel
              designersOptions={designerOptions}
              selectedObject={selectedObject}
              onChange={handlePropertyChange}
              onClearSelection={() => setSelectedObjectId(undefined)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface SceneProps {
  objects: SceneObject[];
  selectedObjectId?: string;
  hoveredObjectId?: string;
  onSelectObject: (id?: string) => void;
  onHoverObject: (id?: string) => void;
  onGroundDoubleClick: (point: { x: number; y: number; z: number }) => void;
  onUpdateObjectPosition: (
    id: string,
    position: { x: number; y: number; z: number }
  ) => void;
}

const Scene: React.FC<SceneProps> = ({
  objects,
  selectedObjectId,
  hoveredObjectId,
  onSelectObject,
  onHoverObject,
  onGroundDoubleClick,
  onUpdateObjectPosition
}) => {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight
        args={[new Color("#4b5563"), new Color("#020617"), 0.35]}
      />

      <Ground onDoubleClick={onGroundDoubleClick} />

      {objects.map((obj) => {
        const isSelected = obj.id === selectedObjectId;
        const isHovered = obj.id === hoveredObjectId;
        return (
          <SceneObjectMesh
            key={obj.id}
            object={obj}
            isSelected={isSelected}
            isHovered={isHovered}
            onSelect={() => onSelectObject(obj.id)}
            onHover={(hovered) =>
              onHoverObject(hovered ? obj.id : undefined)
            }
            onPositionCommit={(position) =>
              onUpdateObjectPosition(obj.id, position)
            }
          />
        );
      })}

      <OrbitControls makeDefault enablePan enableZoom />
    </>
  );
};

interface GroundProps {
  onDoubleClick: (point: { x: number; y: number; z: number }) => void;
}

const Ground: React.FC<GroundProps> = ({ onDoubleClick }) => {
  return (
    <mesh
      rotation-x={-Math.PI / 2}
      position={[0, 0, 0]}
      receiveShadow
      onDoubleClick={(e) => {
        e.stopPropagation();
        const p = e.point;
        onDoubleClick({ x: p.x, y: p.y, z: p.z });
      }}
    >
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#020617" />
    </mesh>
  );
};

interface SceneObjectMeshProps {
  object: SceneObject;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onPositionCommit: (pos: { x: number; y: number; z: number }) => void;
}

const SceneObjectMesh: React.FC<SceneObjectMeshProps> = ({
  object,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onPositionCommit
}) => {
  const [tempPos, setTempPos] = useState(object.position);

  const baseColor = new Color(object.color);
  const hoverColor = new Color("#38bdf8");
  const selectedColor = new Color("#eab308");

  const displayColor = isSelected
    ? selectedColor
    : isHovered
    ? hoverColor
    : baseColor;

  const scale = sizeToScale(object.size);

  const position: [number, number, number] = [
    tempPos.x,
    tempPos.y,
    tempPos.z
  ];

  const handleTransformChange = (newPos: { x: number; y: number; z: number }) => {
    setTempPos(newPos);
  };

  const commitPosition = () => {
    onPositionCommit(tempPos);
  };

  const meshElement = (
    <mesh
      castShadow
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
      }}
    >
      <boxGeometry args={[scale, scale, scale]} />
      <meshStandardMaterial color={displayColor} metalness={0.1} roughness={0.45} />
    </mesh>
  );

  if (!isSelected) {
    return meshElement;
  }

  return (
    <TransformControls
      mode="translate"
      onObjectChange={(e) => {
        const p = e.target.object.position;
        handleTransformChange({ x: p.x, y: p.y, z: p.z });
      }}
      onMouseUp={commitPosition}
    >
      {meshElement}
    </TransformControls>
  );
};

interface ObjectPropertiesPanelProps {
  designersOptions: { value: string; label: string }[];
  selectedObject?: SceneObject;
  onChange: (
    patch: Partial<Omit<SceneObject, "id">>
  ) => Promise<void> | void;
  onClearSelection: () => void;
}

const ObjectPropertiesPanel: React.FC<ObjectPropertiesPanelProps> = ({
  designersOptions,
  selectedObject,
  onChange,
  onClearSelection
}) => {
  if (!selectedObject) {
    return (
      <div className="properties">
        <div className="properties__title">Object properties</div>
        <div className="message message--info">
          No object selected. Click a box in the scene to see and edit its
          properties.
        </div>
      </div>
    );
  }

  return (
    <div className="properties">
      <div className="properties__title">
        Object properties
        <span
          style={{
            fontSize: "0.75rem",
            color: "#9ca3af",
            marginLeft: "0.4rem"
          }}
        >
          #{selectedObject.id.slice(0, 6)}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.25rem"
        }}
      >
        <span className="properties__section-title">General</span>
        <Button
          variant="ghost"
          onClick={onClearSelection}
          style={{ fontSize: "0.75rem", paddingInline: "0.5rem" }}
        >
          Clear selection
        </Button>
      </div>

      <div className="field">
        <label className="field__label">Name</label>
        <input
          className="field__input"
          value={selectedObject.name}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <Select
        label="Designer"
        value={selectedObject.designerId}
        onChange={(e) => onChange({ designerId: e.target.value })}
        options={designersOptions}
      />

      <Select
        label="Size"
        value={selectedObject.size}
        onChange={(e) =>
          onChange({ size: e.target.value as SizeOption })
        }
        options={sizeOptions}
      />

      <ColorPicker
        label="Color"
        value={selectedObject.color}
        onChange={(color) => onChange({ color })}
      />

      <div className="properties__section-title" style={{ marginTop: "0.4rem" }}>
        Position
      </div>
      {(["x", "y", "z"] as const).map((axis) => (
        <div key={axis} className="field">
          <label className="field__label">
            {axis.toUpperCase()}
          </label>
          <input
            className="field__input"
            type="number"
            value={selectedObject.position[axis].toFixed(2)}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              onChange({
                position: {
                  ...selectedObject.position,
                  [axis]: value
                }
              });
            }}
          />
        </div>
      ))}
      <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.35rem" }}>
        Changes are persisted to the mock API and localStorage.
      </div>
    </div>
  );
};

