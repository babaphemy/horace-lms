import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

// export const metadata: Metadata = {
//   title: "Horace Learning Management Solution and School ERP",
//   description:
//     "Horace Learning Management Solution, Online courses, School ERP, LMS",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
