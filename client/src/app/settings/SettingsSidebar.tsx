"use client"
import React from "react";
import { Separator } from "@/components/ui/separator";
import settings from "../data/settings.json";
import { BsFillPersonFill } from "react-icons/bs";

function SettingsSidebar({ selectedSetting  , setSelectedSetting}: { selectedSetting: string , setSelectedSetting: React.Dispatch<React.SetStateAction<string>> }) {
  let icon;
  switch (selectedSetting) {
    case "profile":
      icon = <BsFillPersonFill />;
      break;
    default:
      icon = <BsFillPersonFill />;
      break;
  }

  return (
    <div className="shadow-lg">
      <h1 className="text-lg md:text-xl px-4 py-2 ">Settings</h1>
      <Separator />
      <div className="flex flex-col">
        {settings.settings.map((setting, index) => {
          return (
            <div key={index} className={`px-4 py-2 ${selectedSetting.toLowerCase() === setting.name.toLowerCase() ? "bg-primary/30" : ""} cursor-pointer`} onClick={()=>setSelectedSetting(setting.name)}>
              <h1 className="text-base flex items-center gap-2 ">
                {icon}
                {setting.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {setting.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsSidebar;
