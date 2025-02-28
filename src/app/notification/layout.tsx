import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curhatan Gw | Notifikasi",
};
export default function NotificationLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
