import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Componente Transacao
function Transacao({ transacao, excluirTransacao }) {
  return (
    <div className={`transacao ${transacao.tipo === 'despesa' ? 'despesa' : 'receita'}`}>
      <span className="descricao">{transacao.descricao}</span>
      <span className="valor">{transacao.tipo === 'despesa' ? '-' : ''}${transacao.valor}</span>
      <button className="excluir-btn" onClick={() => excluirTransacao(transacao.id)}>
        Excluir
      </button>
    </div>
  );
}

// Componente ListaDeTransacoes
function ListaDeTransacoes({ transacoes, excluirTransacao }) {
  return (
    <div className="lista-de-transacoes">
      {transacoes.map((transacao) => (
        <Transacao key={transacao.id} transacao={transacao} excluirTransacao={excluirTransacao} />
      ))}
    </div>
  );
}

// Componente ControleFinanceiro
function ControleFinanceiro() {
  const [transacoes, setTransacoes] = useState([]);
  const [novaTransacao, setNovaTransacao] = useState({ descricao: '', valor: '', tipo: 'receita' });

  useEffect(() => {
    // Carregar transações do armazenamento local (se existirem)
    const transacoesArmazenadas = JSON.parse(localStorage.getItem('transacoes')) || [];
    setTransacoes(transacoesArmazenadas);
  }, []);

  useEffect(() => {
    // Salvar transações no armazenamento local sempre que houver uma mudança
    localStorage.setItem('transacoes', JSON.stringify(transacoes));
  }, [transacoes]);

  const adicionarTransacao = () => {
    if (novaTransacao.descricao.trim() === '' || isNaN(parseFloat(novaTransacao.valor))) return;
    const novaTransacaoObjeto = { id: Date.now(), ...novaTransacao };
    setTransacoes([...transacoes, novaTransacaoObjeto]);
    setNovaTransacao({ descricao: '', valor: '', tipo: 'receita' });
  };

  const excluirTransacao = (id) => {
    const transacoesAtualizadas = transacoes.filter((transacao) => transacao.id !== id);
    setTransacoes(transacoesAtualizadas);
  };

  const calcularSaldo = () => {
    const receitas = transacoes
      .filter((transacao) => transacao.tipo === 'receita')
      .reduce((total, transacao) => total + parseFloat(transacao.valor), 0);

    const despesas = transacoes
      .filter((transacao) => transacao.tipo === 'despesa')
      .reduce((total, transacao) => total + parseFloat(transacao.valor), 0);

    return receitas - despesas;
  };

  return (
    <div className="controle-financeiro">
      <h1>Controle Financeiro Pessoal</h1>
      <div className="entrada-transacao">
        <input
          type="text"
          placeholder="Descrição da transação"
          value={novaTransacao.descricao}
          onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
        />
        <input
          type="number"
          placeholder="Valor"
          value={novaTransacao.valor}
          onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: e.target.value })}
        />
        <select
          value={novaTransacao.tipo}
          onChange={(e) => setNovaTransacao({ ...novaTransacao, tipo: e.target.value })}
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <button onClick={adicionarTransacao}>Adicionar Transação</button>
      </div>
      <ListaDeTransacoes transacoes={transacoes} excluirTransacao={excluirTransacao} />
      <div className="saldo">
        <span>Saldo:</span>
        <span className={calcularSaldo() >= 0 ? 'saldo-positivo' : 'saldo-negativo'}>
          ${calcularSaldo().toFixed(2)}
        </span>
      </div>
    </div>
  );
}

ReactDOM.render(<ControleFinanceiro />, document.getElementById('root'));

export default App;
