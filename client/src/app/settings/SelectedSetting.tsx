"use client"
import React, { useState } from 'react'
import ProfileSetting from './ProfileSetting';

const SelectedSetting = ({selectedSetting} : {selectedSetting: string}) => {
  return (
    <div className='h-full col-span-3'>
      {selectedSetting === "Profile" && <ProfileSetting />}
    </div>
  )
}

export default SelectedSetting