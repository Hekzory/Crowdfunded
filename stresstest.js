// Скрипт для тестирования нагрузки на сервер

import http from 'k6/http';
import { check } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const options = {
  vus: 50,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Register new user
  const registerPayload = {
    email: `${randomString(10)}@test.com`,
    password: 'test123',
    name: `User ${randomString(5)}`,
  };

  const registerRes = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(registerPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(registerRes, {
    'registration successful': (r) => r.status === 200,
  });

  if (registerRes.status !== 200) {
    console.error('Registration failed:', registerRes.body);
    return;
  }

  console.log('Registration successful:', registerRes.body);

  // Login
  const loginPayload = {
    email: registerPayload.email,
    password: registerPayload.password,
  };

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(loginPayload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  if (loginRes.status !== 200) {
    console.error('Login failed:', loginRes.body);
    return;
  }

  console.log('Login successful:', loginRes.body);

  // Store cookies for subsequent requests
  const jar = http.cookieJar();
  const cookies = loginRes.cookies;

  Object.keys(cookies).forEach(name => {
    jar.set(BASE_URL, name, cookies[name][0].value);
  });

  // Create project
  const projectPayload = {
    title: `Test Project ${randomString(5)}`,
    description: 'Test project description',
    goal_amount: randomIntBetween(1000, 10000),
    image_url: 'https://example.com/image.jpg',
  };

  const createProjectRes = http.post(`${BASE_URL}/api/projects`, JSON.stringify(projectPayload), {
    headers: { 'Content-Type': 'application/json' },
    cookies: jar,
  });

  check(createProjectRes, {
    'create project successful': (r) => r.status === 201,
  });

  if (createProjectRes.status !== 201) {
    console.error('Project creation failed:', createProjectRes.body);
    return;
  }

  const projectData = JSON.parse(createProjectRes.body);
  const projectId = projectData.project.id;

  // Start project
  const startProjectRes = http.put(`${BASE_URL}/api/projects/${projectId}/start`, null, {
    cookies: jar,
  });

  check(startProjectRes, {
    'start project successful': (r) => r.status === 200,
  });

  if (startProjectRes.status !== 200) {
    console.error('Project start failed:', startProjectRes.body);
  }
}
