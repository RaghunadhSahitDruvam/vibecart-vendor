import React from "react";
import SubCategoryListItem from "./list.item";
const ListAllSubCategories = ({
  subCategories,
  categories,
  setSubCategories,
}: {
  categories: any;
  setSubCategories: any;
  subCategories: any;
}) => {
  return (
    <div>
      <ul className="mt-[1rem]">
        {typeof categories !== "undefined" &&
          subCategories?.map((subCategory: any) => (
            <SubCategoryListItem
              categories={categories}
              subCategory={subCategory}
              key={subCategory._id}
              setSubCategories={setSubCategories}
            />
          ))}
      </ul>
    </div>
  );
};

export default ListAllSubCategories;
