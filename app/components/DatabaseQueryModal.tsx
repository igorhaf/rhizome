import React, { useState } from 'react';

type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite';

interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
}

interface DatabaseQueryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: DatabaseConfig) => void;
}

const DatabaseQueryModal: React.FC<DatabaseQueryModalProps> = ({ open, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<DatabaseConfig>({
    type: 'postgresql',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
  });

  if (!open) return null;

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onSave(config);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleConfigChange = (field: keyof DatabaseConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Selecione o Banco de Dados</h3>
            <div className="grid grid-cols-2 gap-4">
              {(['postgresql', 'mysql', 'mongodb', 'sqlite'] as DatabaseType[]).map((type) => (
                <button
                  key={type}
                  className={`p-4 rounded-lg border ${
                    config.type === type
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-[#333] hover:border-blue-500/50'
                  }`}
                  onClick={() => handleConfigChange('type', type)}
                >
                  <div className="text-white font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Configuração da Conexão</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Host</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-[#333] rounded px-3 py-2 bg-[#1e1e1e] text-white"
                  value={config.host}
                  onChange={(e) => handleConfigChange('host', e.target.value)}
                  placeholder="localhost"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Porta</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-[#333] rounded px-3 py-2 bg-[#1e1e1e] text-white"
                  value={config.port}
                  onChange={(e) => handleConfigChange('port', e.target.value)}
                  placeholder={config.type === 'postgresql' ? '5432' : '3306'}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Nome do Banco</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-[#333] rounded px-3 py-2 bg-[#1e1e1e] text-white"
                  value={config.database}
                  onChange={(e) => handleConfigChange('database', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Usuário</label>
                <input
                  type="text"
                  className="w-full mt-1 border border-[#333] rounded px-3 py-2 bg-[#1e1e1e] text-white"
                  value={config.username}
                  onChange={(e) => handleConfigChange('username', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Senha</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-[#333] rounded px-3 py-2 bg-[#1e1e1e] text-white"
                  value={config.password}
                  onChange={(e) => handleConfigChange('password', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-[#23272e] rounded-lg p-8 w-[600px] max-w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Configuração da Consulta de Dados</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-400 text-lg px-1">×</button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-blue-500' : 'bg-[#333]'
                  }`}
                >
                  <span className="text-white">{stepNumber}</span>
                </div>
                {stepNumber < 2 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-500' : 'bg-[#333]'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            className="px-4 py-2 text-gray-300 hover:text-white"
            onClick={handleBack}
            disabled={step === 1}
          >
            Voltar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleNext}
          >
            {step === 2 ? 'Salvar' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseQueryModal; 