import { redirect } from "next/navigation";
import {
  DEFAULT_MENU_EDITOR_TAB,
  menuEditorTabHref,
} from "@/app/components/admin/menu-editor/tabs";

/** The bare edit URL lands on the first tab. */
export default async function EditMenuItemPage({ params }) {
  const { menu_id } = await params;
  redirect(menuEditorTabHref(menu_id, DEFAULT_MENU_EDITOR_TAB));
}
