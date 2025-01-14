import React from "react";

import AuthLayout from "~/components/layouts/auth";

export default function ExternalLayout({ children }) {
  return <AuthLayout>{children}</AuthLayout>;
}
