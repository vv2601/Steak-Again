/* 01O0 username helpers.
   Client-side validation only; not a security boundary. */
const Username = (() => {
  const MIN_LENGTH = 3;
  const MAX_LENGTH = 16;

  function normalize(name) {
    return String(name ?? "").trim().toLowerCase();
  }

  function validate(name) {
    if (typeof name !== "string") {
      return { ok: false, reason: "Enter a username." };
    }

    const trimmed = name.trim();

    if (
      trimmed.length < MIN_LENGTH ||
      trimmed.length > MAX_LENGTH
    ) {
      return {
        ok: false,
        reason: "Username must be 3–16 characters."
      };
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      return {
        ok: false,
        reason: "Use letters and numbers only."
      };
    }

    return {
      ok: true,
      displayName: trimmed,
      usernameKey: normalize(trimmed)
    };
  }

  return { normalize, validate };
})();
