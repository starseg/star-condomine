import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
