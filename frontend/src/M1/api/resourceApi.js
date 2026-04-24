const BASE_URL = "http://localhost:8080/api/module1/resources";

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = "Something went wrong";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (error) {
      errorMessage = "Server error";
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getAllResources() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

export async function getResourceById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response);
}

export async function createResource(payload) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateResource(id, payload) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function deleteResource(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}

export async function updateResourceStatus(id, status, outOfServiceUntil = null) {
  let url = `${BASE_URL}/${id}/status?status=${encodeURIComponent(status)}`;

  if (outOfServiceUntil) {
    url += `&outOfServiceUntil=${encodeURIComponent(outOfServiceUntil)}`;
  }

  const response = await fetch(url, {
    method: "PATCH",
  });

  return handleResponse(response);
}

export async function searchResources(filters) {
  const params = new URLSearchParams();

  if (filters.keyword) params.append("keyword", filters.keyword);
  if (filters.type) params.append("type", filters.type);
  if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);
  if (filters.location) params.append("location", filters.location);
  if (filters.status) params.append("status", filters.status);

  const response = await fetch(`${BASE_URL}/search?${params.toString()}`);
  return handleResponse(response);
}

export async function getResourceStatistics() {
  const response = await fetch(`${BASE_URL}/statistics`);
  return handleResponse(response);
}