import { AdminHeader } from "@/components/layout/admin.header";

const AdminLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return(
        <div className="">
            <AdminHeader />

            <main>
                {children}
            </main>
        </div>
    )
}

export default AdminLayout;