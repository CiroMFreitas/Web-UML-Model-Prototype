import React from 'react';
import CommandLine from '../CommandLine/CommandLine';
import "./CommandPanel.css";

export default function CommandPanel({ commands }) {
  return (
    <div id="CommandPanel">
      <div id="CommandHistory" aria-live="polite" disabled>
      </div>
      
      <textarea id="CommandConsole" aria-label="Console de comandos" autofocus></textarea>
    </div>
  );
}
/*
*/
