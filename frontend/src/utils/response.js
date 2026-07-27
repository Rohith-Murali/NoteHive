export const normalizeResponse = (payload) => {
  if (payload == null) return {};

  if (Array.isArray(payload))
    return { success: true, data: payload, message: "Success" };

  if (payload && typeof payload === "object") {
    if (payload.success !== undefined) {
      return {
        success: payload.success,
        data: payload.data ?? payload.result ?? null,
        message: payload.message || "Success",
      };
    }

    if (payload.data && typeof payload.data === "object") {
      return {
        success: true,
        data: payload.data,
        message: payload.message || "Success",
      };
    }

    return {
      success: true,
      data: payload,
      message: payload.message || "Success",
    };
  }

  return { success: true, data: payload, message: "Success" };
};

export const unwrapData = (payload) => normalizeResponse(payload).data;

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message || error?.message || "Something went wrong"
  );
};
