import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDesignersStore } from "../store/designersStore";
import { useObjectsStore } from "../store/objectsStore";
import { Button } from "../shared/components/Button";
import { Modal } from "../shared/components/Modal";
import { Input } from "../shared/components/Input";
import { Table } from "../shared/components/Table";
import { Toolbar } from "../shared/components/Toolbar";
import {
  DesignerFormValues,
  designerFormSchema
} from "../shared/validation/designerSchema";

interface DesignerRow {
  id: string;
  fullName: string;
  workingHours: string;
  attachedObjectsCount: number;
}

export const DesignersPage: React.FC = () => {
  const {
    designers,
    fetchDesigners,
    createDesigner,
    loading,
    error: designersError
  } = useDesignersStore();
  const { objects, fetchObjects } = useObjectsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DesignerFormValues>({
    resolver: zodResolver(designerFormSchema),
    defaultValues: { fullName: "", workingHours: "" }
  });

  useEffect(() => {
    if (designers.length === 0) {
      void fetchDesigners();
    }
    if (objects.length === 0) {
      void fetchObjects();
    }
  }, [designers.length, objects.length, fetchDesigners, fetchObjects]);

  const rows: DesignerRow[] = useMemo(
    () =>
      designers.map((d) => ({
        ...d,
        attachedObjectsCount: objects.filter((o) => o.designerId === d.id).length
      })),
    [designers, objects]
  );

  const onSubmit = async (values: DesignerFormValues) => {
    await createDesigner({
      fullName: values.fullName,
      workingHours: values.workingHours
    });
    reset();
    setIsModalOpen(false);
  };

  return (
    <div className="page">
      <div className="card">
        <Toolbar
          left={<h1 style={{ fontSize: "1rem", margin: 0 }}>Designers</h1>}
          right={
            <Button onClick={() => setIsModalOpen(true)} disabled={loading}>
              ＋ Add New
            </Button>
          }
        />
        {designersError && (
          <div className="message message--error" style={{ marginBottom: "0.6rem" }}>
            {designersError}
          </div>
        )}
        <Table<DesignerRow>
          data={rows}
          columns={[
            {
              key: "name",
              header: "Full name",
              render: (row) => row.fullName
            },
            {
              key: "hours",
              header: "Working hours",
              render: (row) => (
                <span className="badge" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {row.workingHours}
                </span>
              )
            },
            {
              key: "objects",
              header: "Attached objects",
              render: (row) => (
                <span>
                  {row.attachedObjectsCount}{" "}
                  <span style={{ color: "#64748b", fontSize: "0.8rem" }}>objects</span>
                </span>
              )
            }
          ]}
          emptyMessage="No designers yet."
        />
        <div style={{ marginTop: "0.6rem", fontSize: "0.78rem", color: "#9ca3af" }}>
          Data is stored locally in your browser via the mock API layer.
        </div>
      </div>

      <Modal
        title="Add new designer"
        open={isModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsModalOpen(false);
          }
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full name"
            placeholder="e.g. Jane Doe"
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <Input
            label="Working hours"
            placeholder="09:00-17:00"
            {...register("workingHours")}
            error={errors.workingHours?.message}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
              marginTop: "0.6rem"
            }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                if (!isSubmitting) {
                  setIsModalOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

