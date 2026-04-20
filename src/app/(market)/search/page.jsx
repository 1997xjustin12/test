import OldSearchPage from "@/app/components/template/SearchPage";
import NewSearchPage from "@/app/components/new-design/page/SearchPage"
import { UIV2 } from "@/app/lib/helpers";

export default function SearchPage(props) {
  return (<>
  {!UIV2 && <OldSearchPage props={props}/>}
  {UIV2 && <NewSearchPage />}
  </>);
}
