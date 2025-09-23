import MyAccountLinks from "@/app/components/atom/MyAccountLinks";

export default function MyAccountLayout({ children }) {
  return (
    <div className="container mx-auto flex flex-col min-h-screen gap-[20px] p-[10px] md:px-[20px] pt-[40px]">
      <h2>My Account</h2>
      <div className="flex gap-[20px]">
        <aside className="w-64">
          <MyAccountLinks />
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
