import React, { createContext, useContext, useState, useEffect } from 'react';

const EmpreendimentoContext = createContext();

export const useEmpreendimento = () => {
    const context = useContext(EmpreendimentoContext);
    if (!context) {
        throw new Error('useEmpreendimento must be used within an EmpreendimentoProvider');
    }
    return context;
};

export const EmpreendimentoProvider = ({ children, empreendimentos = [], userEmpreendimentoId = null }) => {
    const [selectedEmpreendimento, setSelectedEmpreendimento] = useState(() => {
        // First check localStorage for saved preference
        const saved = localStorage.getItem('selected-empreendimento');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Verify the saved empreendimento still exists in the list
            if (empreendimentos.some(e => e.empreendimento_id === parsed?.empreendimento_id)) {
                return parsed;
            }
        }
        // If user has an assigned empreendimento, use that
        if (userEmpreendimentoId && empreendimentos.length > 0) {
            const userEmp = empreendimentos.find(e => e.empreendimento_id === userEmpreendimentoId);
            if (userEmp) return userEmp;
        }
        // Default to null (show all / no filter)
        return null;
    });

    // Update localStorage when selection changes
    useEffect(() => {
        if (selectedEmpreendimento) {
            localStorage.setItem('selected-empreendimento', JSON.stringify(selectedEmpreendimento));
        } else {
            localStorage.removeItem('selected-empreendimento');
        }
    }, [selectedEmpreendimento]);

    // Re-validate selection when empreendimentos list changes
    useEffect(() => {
        if (selectedEmpreendimento && empreendimentos.length > 0) {
            const stillExists = empreendimentos.some(
                e => e.empreendimento_id === selectedEmpreendimento.empreendimento_id
            );
            if (!stillExists) {
                setSelectedEmpreendimento(null);
            }
        }
    }, [empreendimentos]);

    const selectEmpreendimento = (empreendimento) => {
        setSelectedEmpreendimento(empreendimento);
    };

    const clearSelection = () => {
        setSelectedEmpreendimento(null);
    };

    const value = {
        selectedEmpreendimento,
        selectEmpreendimento,
        clearSelection,
        empreendimentos,
        // Helper to check if an item belongs to selected empreendimento
        belongsToSelected: (empreendimentoId) => {
            if (!selectedEmpreendimento) return true; // No filter, show all
            return empreendimentoId === selectedEmpreendimento.empreendimento_id;
        }
    };

    return (
        <EmpreendimentoContext.Provider value={value}>
            {children}
        </EmpreendimentoContext.Provider>
    );
};
