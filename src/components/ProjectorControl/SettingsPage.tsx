import React, { useState } from 'react';


const Settings = () => {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Display Settings</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Power Off</label>
                <select className="rounded-md border p-1">
                  <option>Never</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Default Input</label>
                <select className="rounded-md border p-1">
                  <option>HDMI 1</option>
                  <option>HDMI 2</option>
                  <option>DisplayPort</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Network Settings</h3>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">DHCP</label>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Connect</label>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Settings;