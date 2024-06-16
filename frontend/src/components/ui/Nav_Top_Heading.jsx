import React from "react";

function Nav_Top_Heading({Title}=props) {
  return (
    <div className="w-full flex-1">
      <form>
        <div className="relative">
          <div className="flex items-center gap-2 font-semibold">
            <span className="">{Title}</span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Nav_Top_Heading;
