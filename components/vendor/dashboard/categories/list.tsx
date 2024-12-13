import React from "react";
import CategoryListItem from "./list.item";

const ListAllCategories = ({
  categories,
  setCategories,
}: {
  categories: any;
  setCategories: any;
}) => {
  return (
    <div>
      <ul className="mt-[1rem]">
        {typeof categories !== "undefined" &&
          categories?.map((category: any) => (
            <CategoryListItem
              category={category}
              key={category._id}
              setCategories={setCategories}
            />
          ))}
      </ul>
    </div>
  );
};

export default ListAllCategories;
