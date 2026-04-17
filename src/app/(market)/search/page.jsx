import OldSearchPage from "@/app/components/template/SearchPage";
import NewSearchPage from "@/app/components/new-design/page/SearchPage"

const UIV2 = process.env.NEXT_PUBLIC_UIV2;

export default function SearchPage(props) {
  return (<>
  {!UIV2 && <OldSearchPage props={props}/>}
  {UIV2 && <NewSearchPage />}
  </>);
}
