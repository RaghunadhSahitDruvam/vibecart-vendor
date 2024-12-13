import React, { useRef, useState } from "react";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { modals } from "@mantine/modals";

import { useRouter } from "next/navigation";
import {
  deleteSubCategory,
  updateSubCategory,
} from "@/lib/database/actions/vendor/subCategories/subcategories.actions";

const SubCategoryListItem = ({
  subCategory,
  setSubCategories,
  categories,
}: {
  subCategory: any;
  categories: any;
  setSubCategories: any;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");

  const input = useRef<any>(null);
  const router = useRouter();
  const handleRemoveSubCategory = async (subCategoryId: string) => {
    try {
      await deleteSubCategory(subCategoryId)
        .then((res) => {
          if (res?.success) {
            setSubCategories(res?.subCategories);
            alert(res?.message);
          }
        })
        .catch((err) => alert(err));
    } catch (error: any) {
      alert(error);
    }
  };
  const handleUpdateSubCategory = async (subCategoryId: string) => {
    try {
      const updatedParent = parent ? parent : null;
      await updateSubCategory(
        subCategoryId,
        name || subCategory.name.toString(),
        updatedParent
      )
        .then((res) => {
          if (res?.success) {
            alert(res?.message);
            router.refresh();
          }
        })
        .catch((err) => alert(err));
    } catch (error: any) {
      alert(error);
    }
  };

  return (
    <div>
      <li className="flex p-[10px] bg-blue-400 mt-[10px] text-whit font-bold items-center justify-between  ">
        <TextInput
          value={name ? name : subCategory.name}
          onChange={(e) => setName(e.target.value)}
          disabled={!open}
          ref={input}
          className={
            open ? "bg-white !text-black" : "text-white bg-transparent"
          }
        />
        {open && (
          <Group>
            <select
              name="parent"
              value={parent || subCategory?.parent?._id}
              onChange={(e: any) => setParent(e.target.value)}
              disabled={!open}
              className="text-black h-[55px] pl-[1rem] outline-none"
            >
              {categories.map((c: any) => (
                <option value={c._id} key={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button onClick={() => handleUpdateSubCategory(subCategory._id)}>
              Save
            </Button>
            <Button
              color="red"
              onClick={() => {
                setOpen(false);
                setName("");
              }}
            >
              Cancel
            </Button>
          </Group>
        )}
        <div className="flex">
          {!open && (
            <AiTwotoneEdit
              className="w-[22px] h-[22px] cursor-pointer ml-[1rem] "
              onClick={() => {
                setOpen((prev) => !prev);
                input?.current?.focus();
              }}
            />
          )}
          <AiFillDelete
            className="w-[22px] h-[22px] cursor-pointer ml-[1rem] "
            onClick={() => {
              modals.openConfirmModal({
                title: "Delete Sub category",
                centered: true,
                children: (
                  <Text size="sm">
                    Are you sure you want to delete Sub category? This action is
                    irreversible.
                  </Text>
                ),
                labels: {
                  confirm: "Delete Sub Category",
                  cancel: "No don't delete it",
                },
                confirmProps: { color: "red" },
                onCancel: () => console.log("Cancel"),
                onConfirm: () => handleRemoveSubCategory(subCategory._id),
              });
            }}
          />
        </div>
      </li>
    </div>
  );
};

export default SubCategoryListItem;
