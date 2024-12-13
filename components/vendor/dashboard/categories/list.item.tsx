import React, { useRef, useState } from "react";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { AiFillDelete, AiTwotoneEdit } from "react-icons/ai";
import { modals } from "@mantine/modals";
import { useRouter } from "next/navigation";
import {
  deleteCategory,
  updateCategory,
} from "@/lib/database/actions/vendor/category/category.actions";

const CategoryListItem = ({
  category,
  setCategories,
}: {
  category: any;
  setCategories: any;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState("");
  const input = useRef<any>(null);
  const router = useRouter();
  const handleRemoveCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
        .then((res) => {
          if (res?.success) {
            setCategories(res?.categories);
            alert(res?.message);
          }
        })
        .catch((err) => alert(err));
    } catch (error: any) {
      alert(error);
    }
  };
  const handleUpdateCategory = async (categoryId: string) => {
    try {
      await updateCategory(categoryId, name)
        .then((res) => {
          if (res?.success) {
            setCategories(res?.categories);
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
          value={name ? name : category.name}
          onChange={(e) => setName(e.target.value)}
          disabled={!open}
          ref={input}
          className={
            open ? "bg-white !text-black" : "text-white bg-transparent"
          }
        />
        {open && (
          <Group>
            <Button onClick={() => handleUpdateCategory(category._id)}>
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
                title: "Delete category",
                centered: true,
                children: (
                  <Text size="sm">
                    Are you sure you want to delete category? This action is
                    irreversible.
                  </Text>
                ),
                labels: {
                  confirm: "Delete category",
                  cancel: "No don't delete it",
                },
                confirmProps: { color: "red" },
                onCancel: () => console.log("Cancel"),
                onConfirm: () => handleRemoveCategory(category._id),
              });
            }}
          />
        </div>
      </li>
    </div>
  );
};

export default CategoryListItem;
