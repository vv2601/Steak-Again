/* Firebase profile sync for 01O0.
   Loaded by the private loader; intentionally uses dynamic imports. */
const FirebaseProfile = (() => {
   window.__firebaseModuleLoaded = true;
  const firebaseConfig = {
    apiKey: "AIzaSyCqWmZU7nap7dqYTRfJTExjaQjXHuYMDUg",
    authDomain: "zero-to-a-hundred.firebaseapp.com",
    projectId: "zero-to-a-hundred",
    appId: "1:25213335490:web:6bd96da8687e3a99f1085b"
  };

  let started = false;
  let db = null;
  let user = null;
  let profileRef = null;
  let firestore = null;

  const allowedThemes = ["system", "light", "dark"];

  async function init() {
    if (started) return;
    started = true;

    const status = document.createElement("p");
    status.textContent = "Connecting to Firebase…";

    try {
      const [appSDK, authSDK, dbSDK] = await Promise.all([
        import("https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js"),
        import("https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js")
      ]);

      const app = appSDK.initializeApp(firebaseConfig);
      const auth = authSDK.getAuth(app);

      db = dbSDK.getFirestore(app);
      firestore = dbSDK;

      const credential = await authSDK.signInAnonymously(auth);
      user = credential.user;

      profileRef = dbSDK.doc(db, "profiles", user.uid);

      mountPanel(status);
      await loadProfile(status);

      try {
        await loadEquipped();
      } catch (error) {
        console.error("Cloud cosmetics load failed:", error);
      }
    } catch (error) {
      console.error("Firebase profile setup failed:", error);
      status.textContent =
        "Firebase error: " + (error.message || "Could not connect.");
      mountPanel(status);
    }
  }

  function mountPanel(status) {
    if (document.getElementById("firebase-profile-panel")) return;

    const panel = document.createElement("details");
    panel.id = "firebase-profile-panel";

    panel.style.cssText = [
      "position:fixed",
      "right:12px",
      "bottom:12px",
      "z-index:99999",
      "width:260px",
      "max-width:calc(100vw - 24px)",
      "padding:12px",
      "background:#fff",
      "color:#222",
      "border:1px solid #aaa",
      "border-radius:10px",
      "font:14px/1.45 sans-serif",
      "box-shadow:0 2px 12px #0003"
    ].join(";");

    panel.innerHTML = `
      <summary style="cursor:pointer;font-weight:bold">
        Cloud profile
      </summary>
      <div style="padding-top:12px">
        <label for="fb-display-name">Display name</label>
        <input id="fb-display-name" maxlength="24"
          autocomplete="nickname"
          style="box-sizing:border-box;width:100%;padding:7px;margin:4px 0 10px">

        <label for="fb-theme">Theme preference</label>
        <select id="fb-theme"
          style="box-sizing:border-box;width:100%;padding:7px;margin:4px 0 10px">
          <option value="system">System default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>

        <div style="display:flex;gap:6px">
          <button id="fb-save" type="button">Save profile</button>
          <button id="fb-load" type="button">Reload</button>
        </div>

        <p id="fb-status" role="status" aria-live="polite"></p>
      </div>
    `;

    document.body.appendChild(panel);

    const nameInput = panel.querySelector("#fb-display-name");
    const themeInput = panel.querySelector("#fb-theme");
    const saveButton = panel.querySelector("#fb-save");
    const loadButton = panel.querySelector("#fb-load");
    const message = panel.querySelector("#fb-status");

    message.textContent = status.textContent;

    saveButton.addEventListener("click", async () => {
      if (!profileRef || !firestore) {
        message.textContent = "Firebase isn't connected yet.";
        return;
      }

      const displayName = nameInput.value.trim();

      if (displayName.length > 24) {
        message.textContent = "Use 24 characters or fewer.";
        return;
      }

      if (!allowedThemes.includes(themeInput.value)) {
        message.textContent = "Please choose a valid theme.";
        return;
      }

      saveButton.disabled = true;
      message.textContent = "Saving…";

      try {
        await firestore.setDoc(profileRef, {
          displayName,
          theme: themeInput.value,
          updatedAt: firestore.serverTimestamp()
        });

        message.textContent = "Profile saved to Firebase.";
      } catch (error) {
        console.error("Profile save failed:", error);
        message.textContent =
          "Save failed: " + (error.message || "Unknown error");
      } finally {
        saveButton.disabled = false;
      }
    });

    loadButton.addEventListener("click", () => loadProfile(status, message));

    panel._profileFields = { nameInput, themeInput, message };
  }

  async function loadProfile(status, messageOverride) {
    const panel = document.getElementById("firebase-profile-panel");
    const fields = panel && panel._profileFields;
    const message = messageOverride || (fields && fields.message);

    if (!profileRef || !firestore || !fields) {
      if (message) message.textContent = status.textContent;
      return;
    }

    try {
      if (message) message.textContent = "Loading profile…";

      const snapshot = await firestore.getDoc(profileRef);
      const data = snapshot.exists() ? snapshot.data() : {};

      fields.nameInput.value =
        typeof data.displayName === "string"
          ? data.displayName.slice(0, 24)
          : "";

      fields.themeInput.value =
        allowedThemes.includes(data.theme) ? data.theme : "system";

      if (message) {
        message.textContent = snapshot.exists()
          ? "Cloud profile loaded."
          : "No cloud profile yet. Save one to get started.";
      }
    } catch (error) {
      console.error("Profile load failed:", error);
      if (message) {
        message.textContent =
          "Load failed: " + (error.message || "Unknown error");
      }
    }
  }

  function validEquipped(id, type) {
    if (id === null) return true;
    if (typeof id !== "string") return false;

    const cosmetic = Cos.by(id);

    return !!cosmetic &&
      cosmetic.type === type &&
      Inv.owned(id);
  }

  async function claimUsername(input) {
    if (!user || !db || !firestore) {
      throw new Error("Firebase profile isn't ready.");
    }

    const result = Username.validate(input);

    if (!result.ok) {
      throw new Error(result.reason);
    }

    const usernameKey = result.usernameKey;

    const uidRef = firestore.doc(
      db, "usernamesByUid", user.uid
    );
    const nameRef = firestore.doc(
      db, "usernames", usernameKey
    );

    await firestore.runTransaction(db, async (transaction) => {
      // Read both documents before writing either one.
      const uidSnapshot = await transaction.get(uidRef);
      const nameSnapshot = await transaction.get(nameRef);

      if (uidSnapshot.exists()) {
        throw new Error("This account already has a username.");
      }

      if (nameSnapshot.exists()) {
        throw new Error("That username is already taken.");
      }

      transaction.set(nameRef, {
        uid: user.uid,
        username: usernameKey,
        createdAt: firestore.serverTimestamp()
      });

      transaction.set(uidRef, {
        usernameKey,
        createdAt: firestore.serverTimestamp()
      });
    });

    return { username: usernameKey };
  }
  async function syncEquipped() {
    if (!profileRef || !firestore) {
      throw new Error("Firebase profile isn't ready.");
    }

    const grad = Store.d.eq.grad ?? null;
    const tag = Store.d.eq.tag ?? null;

    if (
      !validEquipped(grad, "grad") ||
      !validEquipped(tag, "tag")
    ) {
      throw new Error("Equipped cosmetics failed validation.");
    }

    await firestore.setDoc(profileRef, {
      equippedGrad: grad,
      equippedTag: tag,
      updatedAt: firestore.serverTimestamp()
    }, { merge: true });
  }

  async function loadEquipped() {
    if (!profileRef || !firestore) return;

    const snapshot = await firestore.getDoc(profileRef);
    if (!snapshot.exists()) return;

    const data = snapshot.data();

    if (
      !Object.prototype.hasOwnProperty.call(data, "equippedGrad") ||
      !Object.prototype.hasOwnProperty.call(data, "equippedTag")
    ) {
      return;
    }

    const grad = data.equippedGrad;
    const tag = data.equippedTag;

    if (
      !validEquipped(grad, "grad") ||
      !validEquipped(tag, "tag")
    ) {
      console.warn(
        "Cloud cosmetics are invalid or not owned; keeping local equipment."
      );
      return;
    }

    const result = Inv.apply(tag, grad);

    if (!result) {
      console.warn("Could not apply cloud-equipped cosmetics.");
    }
  }
 // Temporary debugging hook; remove after testing.
  window.__testClaimUsername = async function (input) {
    try {
      const result = await claimUsername(input);
      console.log("Username claim succeeded:", result);
      return result;
    } catch (error) {
      console.error("Username claim failed:", error);
      throw error;
    }
  };

  return {
    init,
    syncEquipped,
    claimUsername
  };
})();
