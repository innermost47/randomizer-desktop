import { app } from "../script.js";

export class Menu {
  constructor() {
    this.newBtn = document.createElement("button");
    this.openBtn = document.createElement("button");
    this.saveBtn = document.createElement("button");
    this.saveAsBtn = document.createElement("button");
    this.deleteBtn = document.createElement("button");
    this.importBtn = document.createElement("button");
    this.exportBtn = document.createElement("button");
    this.trackSelector = document.createElement("select");
    this.menuContainer = document.createElement("div");
    this.dialogBox = document.createElement("div");
    this.dialogBoxOverlay = document.createElement("div");
    this.dialogBoxLogo = document.createElement("img");
    this.dialogLabel = document.createElement("label");
    this.saveName = document.createElement("input");
    this.confirm = document.createElement("button");
    this.cancel = document.createElement("button");
    this.disclaimer = document.createElement("p");
    this.buttonContainer = document.createElement("div");
    this.message = document.createElement("p");
    this.trackListForDeletion = document.createElement("ul");
    this.successMessageBox = document.createElement("div");
    this.successMessage = document.createElement("h3");
    this.importFile = document.createElement("input");
    this.mode = "new";
    this.trackList = [];
  }

  createHtml(parentHTML) {
    this.newBtn.id = "new";
    this.newBtn.innerHTML = "NEW";
    this.openBtn.id = "open";
    this.openBtn.innerHTML = "Open";
    this.saveBtn.id = "save";
    this.saveBtn.innerHTML = "Save";
    this.saveAsBtn.id = "save-as";
    this.saveAsBtn.innerHTML = "Save as";
    this.deleteBtn.id = "delete";
    this.deleteBtn.innerHTML = "Delete";
    this.importBtn.id = "import";
    this.importBtn.innerHTML = "Import";
    this.exportBtn.id = "export";
    this.exportBtn.innerHTML = "Export";
    this.menuContainer.className = "menu-container";
    this.menuContainer.appendChild(this.newBtn);
    this.menuContainer.appendChild(this.openBtn);
    this.menuContainer.appendChild(this.saveBtn);
    this.menuContainer.appendChild(this.saveAsBtn);
    this.menuContainer.appendChild(this.deleteBtn);
    this.menuContainer.appendChild(this.importBtn);
    this.menuContainer.appendChild(this.exportBtn);
    parentHTML.appendChild(this.menuContainer);
  }

  createModal(parentHTML) {
    this.dialogBox.className = "dialog";
    this.dialogBoxOverlay.className = "dialog-overlay";
    this.dialogBoxLogo.src = "./images/logo.png";
    this.dialogBoxLogo.setAttribute("draggable", false);
    this.dialogBoxLogo.className = "modal-logo";
    this.saveName.type = "text";
    this.saveName.id = "saveName";
    this.message.innerHTML = "";
    this.message.className = "dialog-error-message";
    this.buttonContainer.className = "dialog-button-container";
    this.trackSelector.className = "track-list";
    this.trackListForDeletion.className = "track-list-for-deletion";
    this.dialogBoxOverlay.style.display = "none";
    this.dialogBox.style.display = "none";
    this.successMessageBox.className = "success-message-box";
    this.successMessage.innerHTML = "";
    this.importFile.type = "file";
    this.importFile.style.display = "none";
    this.dialogBox.appendChild(this.dialogBoxLogo);
    this.dialogBox.appendChild(this.dialogLabel);
    this.dialogBox.appendChild(this.saveName);
    this.dialogBox.appendChild(this.trackSelector);
    this.dialogBox.appendChild(this.trackListForDeletion);
    this.dialogBox.appendChild(this.importFile);
    this.dialogBox.appendChild(this.message);
    this.buttonContainer.appendChild(this.confirm);
    this.buttonContainer.appendChild(this.cancel);
    this.dialogBox.appendChild(this.buttonContainer);
    this.dialogBox.appendChild(this.disclaimer);
    this.successMessageBox.appendChild(this.successMessage);
    parentHTML.appendChild(this.dialogBoxOverlay);
    parentHTML.appendChild(this.dialogBox);
    parentHTML.appendChild(this.successMessageBox);
    this.openWelcomeBoxDialog();
  }

  addEventsListeners() {
    this.newBtn.addEventListener("click", () => {
      this.openNewBoxDialog();
    });
    this.openBtn.addEventListener("click", () => {
      this.openOpenBoxDialog();
    });
    this.saveBtn.addEventListener("click", () => {
      if (app.track.title == "untitled") {
        this.openSaveBoxDialog();
      } else {
        this.save();
      }
    });
    this.saveAsBtn.addEventListener("click", () => {
      this.openSaveBoxDialog();
    });
    this.deleteBtn.addEventListener("click", () => {
      this.openDeleteBoxDialog();
    });
    this.importBtn.addEventListener("click", () => {
      this.openImportBoxDialog();
    });
    this.exportBtn.addEventListener("click", () => {
      this.openExportBoxDialog();
    });
    this.confirm.addEventListener("click", () => {
      if (this.mode == "save") {
        if (this.saveName.value == "untitled") {
          this.message.innerHTML = "You must choose an other name";
        } else if (this.saveName.value == "") {
          this.message.innerHTML = "You must choose a name for your settings";
        } else {
          app.track.title = this.saveName.value;
          app.sequencer.title.innerHTML = app.track.title;
          this.save();
          this.closeDialogBox();
        }
      } else if (this.mode == "open") {
        this.openTrack();
        this.closeDialogBox();
      } else if (this.mode == "new") {
        this.resetSettings();
        this.closeDialogBox();
      } else if (this.mode == "delete") {
        this.deleteTracks();
        this.resetList();
      } else if (this.mode == "export") {
        this.export();
        this.closeDialogBox();
      } else if (this.mode == "import") {
        this.import();
        this.closeDialogBox();
      }
    });
    this.cancel.addEventListener("click", () => {
      if (this.mode == "welcome") {
        localStorage.setItem("has-seen", true);
      }
      this.resetList();
      this.resetSelector();
      this.closeDialogBox();
    });
  }

  openWelcomeBoxDialog() {
    if (!localStorage.getItem("has-seen")) {
      this.dialogLabel.innerHTML =
        "Welcome to our music creation application built with vanilla JavaScript! Our app combines both synthesizers and random music generation algorithms to produce unique and dynamic sounds. Along with the TR-808 drum kit, the app offers control tools to manipulate and mix the sounds together, allowing you to create your own custom music. Start exploring and let your creativity flow.";
      this.cancel.innerHTML = "Continue";
      this.disclaimer.innerHTML = "";
      this.dialogBoxOverlay.style.display = "block";
      this.dialogBox.style.display = "flex";
      this.saveName.style.display = "none";
      this.trackSelector.style.display = "none";
      this.confirm.style.display = "none";
      this.trackListForDeletion.style.display = "none";
      this.importFile.style.display = "none";
      this.mode = "welcome";
    } else {
      return;
    }
  }

  openSaveBoxDialog() {
    this.dialogLabel.innerHTML = "Enter a name for your track";
    this.saveName.value = app.track.title;
    this.confirm.innerHTML = "Save";
    this.cancel.innerHTML = "Cancel";
    this.disclaimer.innerHTML =
      "You are about to save your music settings to your browser's local storage. This means that the music you have created will be saved on your device, and you will be able to access it again later. However, please be aware that if you clear your browser's data or use a different device, you will not be able to retrieve your saved music. Also, please note that saving your music in local storage is not a secure method of saving, so please use it at your own risk.";
    this.dialogBoxOverlay.style.display = "block";
    this.dialogBox.style.display = "flex";
    this.saveName.style.display = "block";
    this.trackSelector.style.display = "none";
    this.confirm.style.display = "inline";
    this.trackListForDeletion.style.display = "none";
    this.importFile.style.display = "none";
    this.mode = "save";
  }

  openOpenBoxDialog() {
    this.mode = "open";
    this.getTrackList();
    if (this.trackList.length == 0) {
      this.dialogLabel.innerHTML = "Make a track first and save it";
      this.dialogBoxOverlay.style.display = "block";
      this.dialogBox.style.display = "flex";
      this.saveName.style.display = "none";
      this.trackListForDeletion.style.display = "none";
      this.trackSelector.style.display = "none";
      this.confirm.style.display = "none";
      this.cancel.innerHTML = "Ok";
      this.importFile.style.display = "none";
    } else {
      this.dialogLabel.innerHTML = "Choose the track you want to open";
      this.confirm.innerHTML = "Confirm";
      this.cancel.innerHTML = "Cancel";
      this.disclaimer.innerHTML = "";
      this.confirm.style.display = "inline";
      this.dialogBoxOverlay.style.display = "block";
      this.dialogBox.style.display = "flex";
      this.saveName.style.display = "none";
      this.trackListForDeletion.style.display = "none";
      this.importFile.style.display = "none";
      this.trackSelector.style.display = "block";
      for (let i = 0; i < this.trackList.length; i++) {
        let option = this.createOption(
          this.trackList[i].saveName,
          this.trackList[i].saveName
        );
        this.trackSelector.appendChild(option);
      }
    }
  }

  openNewBoxDialog() {
    this.mode = "new";
    this.dialogLabel.innerHTML =
      "Are you sure you want to start a new track? Any unsaved data will be lost.";
    this.confirm.innerHTML = "Confirm";
    this.cancel.innerHTML = "Cancel";
    this.disclaimer.innerHTML = "";
    this.confirm.style.display = "inline";
    this.dialogBoxOverlay.style.display = "block";
    this.dialogBox.style.display = "flex";
    this.saveName.style.display = "none";
    this.trackSelector.style.display = "none";
    this.trackListForDeletion.style.display = "none";
    this.importFile.style.display = "none";
  }

  openDeleteBoxDialog() {
    this.mode = "delete";
    this.getTrackList();
    if (this.trackList.length == 0) {
      this.dialogLabel.innerHTML = "Make a track first and save it";
      this.dialogBoxOverlay.style.display = "block";
      this.dialogBox.style.display = "flex";
      this.saveName.style.display = "none";
      this.trackListForDeletion.style.display = "none";
      this.trackSelector.style.display = "none";
      this.confirm.style.display = "none";
      this.importFile.style.display = "none";
      this.cancel.innerHTML = "Ok";
    } else {
      this.dialogLabel.innerHTML =
        "Which track would you like to delete? Please select the options below:";
      this.confirm.innerHTML = "Confirm";
      this.cancel.innerHTML = "Cancel";
      this.disclaimer.innerHTML = "";
      this.confirm.style.display = "inline";
      this.dialogBoxOverlay.style.display = "block";
      this.dialogBox.style.display = "flex";
      this.saveName.style.display = "none";
      this.trackSelector.style.display = "none";
      this.importFile.style.display = "none";
      this.trackListForDeletion.style.display = "flex";
      for (let i = 0; i < this.trackList.length; i++) {
        let li = document.createElement("li");
        let label = document.createElement("label");
        label.innerHTML = this.trackList[i].saveName;
        let input = document.createElement("input");
        input.type = "checkbox";
        input.className = "delete-checkbox";
        input.value = this.trackList[i].saveName;
        li.appendChild(label);
        li.appendChild(input);
        this.trackListForDeletion.appendChild(li);
      }
    }
  }

  openExportBoxDialog() {
    this.mode = "export";
    this.dialogLabel.innerHTML =
      "Are you sure you want to download the file? It will be in JSON format.";
    this.confirm.innerHTML = "Confirm";
    this.cancel.innerHTML = "Cancel";
    this.disclaimer.innerHTML = "";
    this.confirm.style.display = "inline";
    this.dialogBoxOverlay.style.display = "block";
    this.dialogBox.style.display = "flex";
    this.saveName.style.display = "none";
    this.trackSelector.style.display = "none";
    this.trackListForDeletion.style.display = "none";
    this.importFile.style.display = "none";
  }

  openImportBoxDialog() {
    this.mode = "import";
    this.dialogLabel.innerHTML =
      "Are you sure you want to upload your track file? It has to be in JSON format.";
    this.confirm.innerHTML = "Confirm";
    this.cancel.innerHTML = "Cancel";
    this.disclaimer.innerHTML = "";
    this.confirm.style.display = "inline";
    this.dialogBoxOverlay.style.display = "block";
    this.dialogBox.style.display = "flex";
    this.saveName.style.display = "none";
    this.trackSelector.style.display = "none";
    this.trackListForDeletion.style.display = "none";
    this.importFile.style.display = "block";
  }

  save() {
    let settings = {};
    let inputElements = document.querySelectorAll("input");
    for (let i = 0; i < inputElements.length; i++) {
      let inputElement = inputElements[i];
      settings[inputElement.id] = inputElement.value;
    }
    app.track.saveTrack(JSON.stringify(settings));
    inputElements = null;
    this.addSuccessMessage("Your track has been saved successfully");
  }

  export() {
    let trackName = app.track.title;
    trackName = trackName.replace(/\s+/g, "_");
    let settings = {};
    let inputElements = document.querySelectorAll("input");
    for (let i = 0; i < inputElements.length; i++) {
      let inputElement = inputElements[i];
      settings[inputElement.id] = inputElement.value;
    }
    let json = JSON.stringify(settings);
    let blob = new Blob([json], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = trackName + ".json";
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this.addSuccessMessage("Your track has been exported successfully");
  }

  import() {
    let file = this.importFile.files[0];
    let reader = new FileReader();
    reader.onload = function () {
      let settings = JSON.parse(reader.result);
      let inputElements = document.querySelectorAll("input");

      for (var i = 0; i < inputElements.length; i++) {
        let inputElement = inputElements[i];
        if (settings[inputElement.id]) {
          inputElement.value = settings[inputElement.id];
        }
      }
      inputElements = null;
      app.track.title = settings.saveName;
      app.sequencer.title.innerHTML = app.track.title;
    };
    reader.readAsText(file);
    let fileInput = this.importFile;
    fileInput.value = null;
    this.importFile = fileInput;
  }

  closeDialogBox() {
    this.resetSelector();
    this.message.innerHTML = "";
    this.disclaimer.innerHTML = "";
    this.dialogBoxOverlay.style.display = "none";
    this.dialogBox.style.display = "none";
  }

  getTrackList() {
    this.trackList = [];
    if (typeof Storage !== "undefined") {
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let track = JSON.parse(localStorage.getItem(key));
        this.trackList.push(track);
      }
    } else {
      console.log("Local storage not supported");
    }
  }

  createOption(label, value) {
    let option = document.createElement("option");
    option.textContent = label;
    option.value = value;
    return option;
  }

  resetList() {
    if (this.mode == "delete") {
      while (this.trackListForDeletion.firstChild) {
        this.trackListForDeletion.removeChild(
          this.trackListForDeletion.firstChild
        );
      }
    }
  }

  resetSelector() {
    if (this.mode == "open") {
      while (this.trackSelector.firstChild) {
        this.trackSelector.removeChild(this.trackSelector.firstChild);
      }
    }
  }

  openTrack() {
    let settings = JSON.parse(localStorage.getItem(this.trackSelector.value));
    let inputElements = document.querySelectorAll("input");

    for (var i = 0; i < inputElements.length; i++) {
      let inputElement = inputElements[i];
      if (settings[inputElement.id]) {
        inputElement.value = settings[inputElement.id];
      }
    }
    inputElements = null;
    app.track.title = settings.saveName;
    app.sequencer.title.innerHTML = app.track.title;
  }

  resetSettings() {
    let settings = app.defaultsSettings;
    let inputElements = document.querySelectorAll("input");

    for (var i = 0; i < inputElements.length; i++) {
      let inputElement = inputElements[i];
      if (settings[inputElement.id]) {
        inputElement.value = settings[inputElement.id];
      }
    }
    inputElements = null;
    app.track.title = app.track.defaultTitle;
    app.sequencer.title.innerHTML = app.track.title;
  }

  deleteTracks() {
    let trackList = document.getElementsByClassName("delete-checkbox");
    let tracksForDeletion = [];
    for (let i = 0; i < trackList.length; i++) {
      if (trackList[i].checked) {
        tracksForDeletion.push(trackList[i].value);
      }
    }
    if (tracksForDeletion.length > 0) {
      if (confirm("Are you sure you want to delete the selected songs?")) {
        for (let i = 0; i < tracksForDeletion.length; i++) {
          app.track.deleteTrack(tracksForDeletion[i]);
        }
        this.closeDialogBox();
        this.addSuccessMessage("Your track(s) have been deleted successfully");
        this.getTrackList();
        if (this.trackList.length == 0) {
          this.resetSettings();
        }
      }
    } else {
      this.closeDialogBox();
    }
  }

  addSuccessMessage(message) {
    this.successMessageBox.style.right = "10px";
    this.successMessage.innerHTML = message;
    setTimeout(() => {
      this.successMessageBox.style.right = "-400px";
    }, 2000);
  }
}
