import React from 'react';
import "./CommandPanel.css";

export default function CommandPanel() {
  return (
    <div id="CommandPanel">
        <textarea id="CommandHistory" aria-live="polite" disabled></textarea>
        <textarea id="CommandConsole" aria-label="Command console" autofocus></textarea>
    </div>
  );
}
