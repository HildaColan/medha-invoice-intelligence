import { Navigate, useParams } from "react-router-dom";
import { SectionHeading } from "@/components/ui";
import { paths } from "@/router/paths";
import type { AdminViewKey } from "@/types";
import { AuditLogsPanel } from "./panels/AuditLogsPanel";
import { CustomerMasterPanel } from "./panels/CustomerMasterPanel";
import { MastersPanel } from "./panels/MastersPanel";
import { OutputMappingPanel } from "./panels/OutputMappingPanel";
import { ProductMasterPanel } from "./panels/ProductMasterPanel";
import { RolesPanel } from "./panels/RolesPanel";
import { UsersPanel } from "./panels/UsersPanel";
import { ValidationRulesPanel } from "./panels/ValidationRulesPanel";

const TITLES: Record<AdminViewKey, string> = {
  users: "Users",
  roles: "Roles & permissions",
  productMaster: "Product master",
  customerMaster: "Customer master",
  masters: "Masters",
  validationRules: "Validation rules",
  outputMapping: "Output mapping",
  auditLogs: "Audit logs",
};

const PANELS: Record<AdminViewKey, () => JSX.Element> = {
  users: UsersPanel,
  roles: RolesPanel,
  productMaster: ProductMasterPanel,
  customerMaster: CustomerMasterPanel,
  masters: MastersPanel,
  validationRules: ValidationRulesPanel,
  outputMapping: OutputMappingPanel,
  auditLogs: AuditLogsPanel,
};

function isAdminViewKey(value: string | undefined): value is AdminViewKey {
  return !!value && value in TITLES;
}

export function AdministrationView() {
  const { view } = useParams<{ view: string }>();

  if (!isAdminViewKey(view)) {
    return <Navigate to={paths.administration("users")} replace />;
  }

  const Panel = PANELS[view];

  return (
    <div className="px-8 py-7">
      <SectionHeading eyebrow="ADMINISTRATION" title={TITLES[view]} />
      <Panel />
    </div>
  );
}
