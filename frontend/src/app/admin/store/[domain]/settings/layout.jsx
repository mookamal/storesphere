import SettingsSidebar from "../../../../../components/admin/settings/SettingsSidebar";


export default function layout({ children }) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-2">
      <div className="hidden md:block xl:w-1/5 w-2/5 xl md:md:flex justify-center card p-2">
        <SettingsSidebar />
      </div>
      <div className="p-4 flex justify-center card w-full md:w-3/5">
        {children}
      </div>
    </div>
  )
}
