#!/bin/bash

# Überprüfe, ob der Webbrowser installiert ist
if ! command -v chromium-browser &> /dev/null
then
    echo "Chromium-Browser ist nicht installiert. Bitte installiere ihn zuerst."
    exit
fi

# Starte den Webbrowser im Vollbildmodus und öffne die Webseite
chromium-browser --kiosk http://localhost:3000/