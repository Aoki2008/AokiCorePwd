const API_URL = 'http://localhost:3001/api';

async function request(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Request failed: ${res.status} ${text}`);
    }
    return res.json();
}

async function runTest() {
    try {
        console.log('1. Creating Project...');
        const project = await request(`${API_URL}/projects`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'Backend Test Project',
                description: 'Testing deletion logic'
            })
        });
        const projectId = project.id;
        console.log('   Project created:', projectId);

        console.log('2. Creating Account...');
        const account = await request(`${API_URL}/accounts`, {
            method: 'POST',
            body: JSON.stringify({
                projectId: projectId,
                name: 'Backend Test Account',
                data: {}
            })
        });
        const accountId = account.id;
        console.log('   Account created:', accountId);

        console.log('3. Soft Deleting Account...');
        await request(`${API_URL}/accounts/${accountId}`, {
            method: 'DELETE'
        });
        console.log('   Account soft deleted');

        console.log('4. Verifying in Trash (Pre-Project Delete)...');
        let trash = await request(`${API_URL}/trash`);
        let trashItem = trash.find(a => a.id === accountId);
        if (!trashItem) throw new Error('Account not found in trash!');
        console.log('   Account found in trash. Project ID:', trashItem.projectId);

        console.log('5. Deleting Project...');
        await request(`${API_URL}/projects/${projectId}`, {
            method: 'DELETE'
        });
        console.log('   Project deleted');

        console.log('6. Verifying in Trash (Post-Project Delete)...');
        trash = await request(`${API_URL}/trash`);
        trashItem = trash.find(a => a.id === accountId);

        if (!trashItem) {
            throw new Error('FAILED: Account was deleted from trash!');
        }

        if (trashItem.projectId !== null) {
            console.error('FAILED: Project ID is not null!', trashItem);
            throw new Error('Project ID should be null');
        }

        console.log('SUCCESS: Account preserved in trash with null projectId.');

    } catch (error) {
        console.error('TEST FAILED:', error.message);
    }
}

runTest();
