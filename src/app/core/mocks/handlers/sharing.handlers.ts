import { http, HttpResponse } from 'msw';

const mockUsers = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    phone: '+5511999999999',
  },
  {
    id: 'user-2',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '+5511888888888',
  },
  {
    id: 'user-3',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '+5511777777777',
  },
  {
    id: 'user-4',
    name: 'Pedro Oliveira',
    email: 'pedro@example.com',
    phone: '+5511666666666',
  },
];

export const sharingHandlers = [
  http.get('/users/search', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const query = url.searchParams.get('query');

    if (!query || query.trim().length === 0) {
      return HttpResponse.json([]);
    }

    const queryLower = query.toLowerCase().trim();
    const filteredUsers = mockUsers.filter(
      (user) =>
        user.email.toLowerCase().includes(queryLower) ||
        user.name.toLowerCase().includes(queryLower) ||
        (user.phone && user.phone.includes(queryLower))
    );

    return HttpResponse.json(filteredUsers.slice(0, 5));
  }),
];
