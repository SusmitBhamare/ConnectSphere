"use client";
import React, { useState } from 'react'
import SettingsSidebar from './SettingsSidebar';
import SelectedSetting from './SelectedSetting';

function SettingsPage() {
  const [selectedSetting, setSelectedSetting] = useState<string>("Profile");
  return (
    <div className="max-w-screen h-[90vh] grid grid-cols-4  mt-16">
      <SettingsSidebar selectedSetting={selectedSetting} setSelectedSetting={setSelectedSetting} />
      <SelectedSetting selectedSetting={selectedSetting} />
    </div>
  );
}

export default SettingsPage