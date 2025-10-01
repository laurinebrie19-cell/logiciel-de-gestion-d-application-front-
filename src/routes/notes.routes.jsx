// Dans router.jsx
{
    path: "/notes",
        children: [
            {
                path: "ajouter",
                element: <AjoutNote />,
            },
            {
                path: "mes-notes",
                element: <NotesEtudiant />,
            },
            {
                path: "niveau",
                element: <NotesParNiveau />,
            },
        ],
},
