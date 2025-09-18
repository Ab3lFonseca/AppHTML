// Configuração do Supabase
const SUPABASE_URL = 'https://tfugrdcgeaxquqyspdiq.supabase.co';
// Chave anônima real do Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdWdyZGNnZWF4cXVxeXNwZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNTY2ODYsImV4cCI6MjA3MzczMjY4Nn0.gQN8JBHn_YTdTORQAJvPrTZflCQGqeBH43otJX4rqH8';

// Configuração da conexão direta com PostgreSQL (para referência)
const DB_CONFIG = {
  host: 'db.tfugrdcgeaxquqyspdiq.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  // Senha deve ser fornecida separadamente por segurança
};

// Inicializar cliente Supabase (será usado quando a biblioteca for adicionada)
let supabaseClient = null;

// Função para inicializar o Supabase
function initializeSupabase() {
  if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase inicializado com sucesso');
    return supabaseClient;
  } else {
    console.error('Biblioteca do Supabase não encontrada. Certifique-se de incluir o script do Supabase.');
    return null;
  }
}

// Função para testar conexão
async function testConnection() {
  if (!supabaseClient) {
    supabaseClient = initializeSupabase();
  }
  
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('locais')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Erro ao testar conexão:', error);
        return false;
      }
      
      console.log('Conexão com Supabase estabelecida com sucesso');
      return true;
    } catch (err) {
      console.error('Erro na conexão:', err);
      return false;
    }
  }
  
  return false;
}

// Funções utilitárias para interação com o banco
const SupabaseAPI = {
  // Inicializar
  init: initializeSupabase,
  
  // Testar conexão
  test: testConnection,
  
  // CRUD para locais
  locais: {
    // Buscar todos os locais
    async getAll() {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('locais')
          .select('*')
          .order('idLocal', { ascending: true });
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Buscar local por ID
    async getById(id) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('locais')
          .select('*')
          .eq('idLocal', id)
          .single();
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Criar novo local
    async create(local) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('locais')
          .insert([{
            descricaoLocal: local.descricaoLocal,
            endLocal: local.endLocal,
            nomeLocal: local.nomeLocal
          }])
          .select();
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Atualizar local
    async update(id, local) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('locais')
          .update({
            descricaoLocal: local.descricaoLocal,
            endLocal: local.endLocal,
            nomeLocal: local.nomeLocal
          })
          .eq('idLocal', id)
          .select();
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Deletar local
    async delete(id) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('locais')
          .delete()
          .eq('idLocal', id);
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Buscar locais por nome
    async searchByName(nome) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('locais')
          .select('*')
          .ilike('nomeLocal', `%${nome}%`);
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    }
  },
  
  // CRUD para usuários
  usuarios: {
    // Buscar todos os usuários
    async getAll() {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('idUsu, emailUsu, nomeUsu, imgmUsu, telefoneUsu')
          .order('idUsu', { ascending: true });
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Buscar usuário por ID
    async getById(id) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('idUsu, emailUsu, nomeUsu, imgmUsu, telefoneUsu')
          .eq('idUsu', id)
          .single();
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Buscar usuário por email
    async getByEmail(email) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('*')
          .eq('emailUsu', email)
          .single();
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Criar novo usuário
    async create(usuario) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .insert([{
            emailUsu: usuario.emailUsu,
            senhaUsu: usuario.senhaUsu, // Em produção, deve ser hash
            nomeUsu: usuario.nomeUsu,
            imgmUsu: usuario.imgmUsu || null,
            telefoneUsu: usuario.telefoneUsu || null
          }])
          .select('idUsu, emailUsu, nomeUsu, imgmUsu, telefoneUsu');
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Atualizar usuário
    async update(id, usuario) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const updateData = {};
        if (usuario.emailUsu) updateData.emailUsu = usuario.emailUsu;
        if (usuario.nomeUsu) updateData.nomeUsu = usuario.nomeUsu;
        if (usuario.imgmUsu !== undefined) updateData.imgmUsu = usuario.imgmUsu;
        if (usuario.telefoneUsu !== undefined) updateData.telefoneUsu = usuario.telefoneUsu;
        if (usuario.senhaUsu) updateData.senhaUsu = usuario.senhaUsu;
        
        const { data, error } = await supabaseClient
          .from('usuarios')
          .update(updateData)
          .eq('idUsu', id)
          .select('idUsu, emailUsu, nomeUsu, imgmUsu, telefoneUsu');
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Deletar usuário
    async delete(id) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .delete()
          .eq('idUsu', id);
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    },
    
    // Autenticar usuário
    async authenticate(email, senha) {
      if (!supabaseClient) supabaseClient = initializeSupabase();
      if (!supabaseClient) return { data: null, error: 'Cliente não inicializado' };
      
      try {
        const { data, error } = await supabaseClient
          .from('usuarios')
          .select('idUsu, emailUsu, nomeUsu, imgmUsu, telefoneUsu')
          .eq('emailUsu', email)
          .eq('senhaUsu', senha) // Em produção, usar hash
          .single();
        
        return { data, error };
      } catch (err) {
        return { data: null, error: err.message };
      }
    }
  }
};

// Exportar para uso global
window.SupabaseAPI = SupabaseAPI;

