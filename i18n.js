// KUROGRAM - Module d'internationalisation (FR / EN / ES) - Créé par Hazraael
const I18N = {
    fr: {
        // Barre supérieure & Contrôles
        streakTitle: "Jours consécutifs",
        helpTitle: "Rappel des 3 Règles (?)",
        newGridTitle: "Nouvelle grille",
        dailyTitle: "Défi du Jour",
        menuTitle: "Menu Principal",
        toolNum: "✍️ Chiffre",
        toolNote: "✏️ Notes",
        toolWall: "⬛ Mur",
        toolVerify: "✔️ Vérifier",
        createdBy: "Créé par",
        saved: "💾 Sauvegardé",
        closeEsc: "Fermer (Échap)",
        cancel: "Annuler",
        confirm: "Confirmer",
        validate: "Valider",
        choose: "Choisir",
        active: "Actif",
        equipped: "Équipé",
        dailyHeader: "📅 Défi du Jour (5x5)",
        rulesStepHeader: "Mode 0 : Règles (Étape {step}/2)",

        // Onglets du Menu Hub
        tabModes: "⚙️ Modes",
        tabStats: "📊 Stats",
        tabThemes: "🏆 Thèmes",
        engravedToggle: "Chiffres gravés 🔒 dans les murs (Modes 0-3)",
        secretPlaceholder: "Code donateur / secret...",
        resetProgressBtn: "🗑️ Réinitialiser ma progression",
        devToolsTitle: "🛠️ Outils Développeur (Test) :",
        debugUnlockBtn: "🔓 Tout débloquer",
        debugResetBtn: "🗑️ Reset Total",
        themesTitle: "Thèmes Visuels",
        achievementsTitle: "Hauts-Faits",

        // Modes de jeu
        mode0Name: "Mode 0 : Règles",
        mode0Desc: "Apprendre les 3 règles d'or pas à pas (2 étapes)",
        mode1Name: "Mode 1 : Apprentissage",
        mode1Desc: "Grilles 3x3 & 4x4 avec assistant (Sans chrono)",
        mode2Name: "Mode 2 : Débutant",
        mode2Desc: "Grilles 4x4, chrono, bonus actifs, murs gravés",
        mode3Name: "Mode 3 : Difficile",
        mode3Desc: "Grilles 5x5, 4 vies, erreurs pénalisées",
        mode4Name: "Mode 4 : Expert",
        mode4Desc: "Grilles 5x5 à 9x9, murs opaques, 2 pubs vie max",
        mode5Name: "Mode 5 : Mode Dieu",
        mode5Desc: "Grilles 5x5 à 9x9, bonus 35% échec, vies dégressives",
        mode6Name: "Mode 6 : 🤩 PGM",
        mode6Desc: "Grilles 10x10 à 16x16 Hexa (10 à 32 bonus par victoire !)",
        modeLocked: "Débloqué à {req} grilles résolues ({cur}/{req})",

        // Thèmes & Bonus
        themePaperName: "Carnet & Crayon",
        themePaperCond: "Débloqué par défaut",
        themePaperB1: "Tampon", themePaperB2: "Plume", themePaperB3: "Crayon",
        themeStoneName: "Plateau & Pierre",
        themeStoneCond: "3 jours consécutifs ou 5 victoires sans bonus",
        themeStoneB1: "Marteau", themeStoneB2: "Burin", themeStoneB3: "Craie",
        themeSlateName: "Nuit d'Ardoise & Or",
        themeSlateCond: "10 victoires sans erreur ou 7 jours consécutifs",
        themeSlateB1: "Sceau", themeSlateB2: "Plume d'Or", themeSlateB3: "Astrolabe",

        // Hauts-Faits
        achPureName: "Esprit Pur",
        achPureDesc: "Gagner 5 grilles sans bonus ({cur}/5)",
        achFlawlessName: "Infaillible",
        achFlawlessDesc: "Série de 10 grilles sans erreur ({cur}/10)",
        achRegularName: "Habitué",
        achRegularDesc: "Connexion 3 jours d'affilée ({cur}/3)",
        achPgmName: "🤩 Maître PGM Hexadécimal",
        achPgmUnlockedDesc: "Mode 6 : 🤩 PGM (10x10 à 16x16) débloqué",
        achPgmLockedDesc: "Terminer 5 grilles 9x9 sans erreur ni bonus (ou code donateur)",

        // Statistiques
        statsShowLabel: "Afficher :",
        statsGlobalOpt: "🌍 Global (Toutes les grilles)",
        statsGridOpt: "Grille {sz}x{sz}",
        statsSolved: "Grilles Résolues ({rate}%)",
        statsBestTime: "Temps le plus rapide",
        statsAvgTime: "Temps Moyen",
        statsWorstTime: "Temps le plus lent",
        statsStarted: "Grilles démarrées :",
        statsAbandoned: "Grilles abandonnées (🔄) :",
        statsLost: "Grilles perdues (Plus de vies) :",
        statsLivesUsed: "Vies utilisées / perdues :",
        statsNoBonus: "Résolues SANS bonus :",
        statsWithBonus: "Résolues AVEC bonus :",
        statsTotalBonuses: "Total de bonus consommés :",
        statsFlawless: "Victoires sans aucune erreur :",

        // Guide & Tutoriel
        tutoStep1WallPlaced: "<strong>Étape 1/2 :</strong> Super ! Le <b>Mur ⬛</b> au milieu cache le chiffre <b><i>2</i> 🔒</b> : ce <b>2</b> ne compte <u>pas</u> dans la somme <b>1 - 3</b>, mais il est déjà pris pour le Sudoku ! Pose maintenant <b>1</b> à gauche et <b>3</b> à droite.",
        tutoStep1Start: "<strong>Étape 1/2 :</strong> Regarde la 1re ligne : l'indice est <b>1 - 3</b> (deux blocs séparés par un Mur). Touche la 1re case et pose <b>1</b>. Touche la case du milieu et clique sur <b>⬛ Mur</b>. Touche la 3e case et pose <b>3</b> ! <i>(Aide : bouton <b>?</b> en haut)</i>.",
        tutoStep2: "<strong>Étape 2/2 (Grille 3x3) :</strong> Chaque ligne/colonne contient <b>1, 2 et 3</b>. Rappel : le chiffre <b>🔒</b> caché sous un <b>Mur ⬛</b> ne s'additionne <u>pas</u> dans les sommes, mais compte pour le Sudoku !",
        hintNoWall: "💡 <b>Astuce :</b> La ligne {r} a une somme de <b>{sum}</b> : elle ne contient donc <b>aucun mur</b> !",
        hintSplitSum: "💡 <b>Astuce :</b> Ligne {r} (<b>{clues}</b>) : place un <b>⬛ Mur</b> entre ces sommes. Le chiffre caché sous le mur ne compte pas dans la somme, mais compte pour le Sudoku !",
        hintDefault: "💡 <b>Astuce :</b> Chaque chiffre de 1 à {n} est unique par ligne et par colonne, même caché sous un Mur ⬛ !",

        // Messages & Modales
        errNotWall: "Ce n'est pas un mur !",
        errIsWall: "Cette case est un mur !",
        errDuplicate: "Chiffre déjà présent sur la ligne ou colonne !",
        errNoLives: "Tu n'as plus de vies.",
        livesLeftToast: "💔 {msg} ({lives} vie(s) restante(s))",
        verifyErrors: "⚠️ {count} case(s) comporte(nt) une erreur (en rouge).",
        verifyOkRemaining: "✔️ Aucune erreur dans tes saisies actuelles ! (Il reste <b>{rem} case(s)</b> à compléter).",
        verifyAllFilled: "✔️ Aucune contradiction ! Vérifie que les sommes des blocs correspondent aux indices.",
        allWallsFound: "Tous les murs sont déjà découverts !",
        godModeFizzle: "⚡ Mode Dieu : Ton bonus s'est brisé sous la pression divine !",

        // Déblocages (Nouveau !)
        unlockTitle: "🎉 NOUVEAU DÉBLOCAGE !",
        unlockModeMsg: "Tu as débloqué <b>{name}</b> !",
        unlockThemeMsg: "Nouveau thème débloqué : <b>{name}</b> !",
        unlockAchMsg: "Haut-Fait accompli : <b>🏆 {name}</b> !",

        // Fin de partie & Pubs
        winTitle: "🎉 Grille Résolue !",
        loseTitle: "💔 Partie Terminée",
        step1DoneTitle: "👏 Étape 1/2 Terminée !",
        step1DoneMsg: "Étape 1/2 réussie ! Passons maintenant à l'Étape 2/2 sur une grille 3x3 complète.",
        nextStepBtn: "Passer à l'Étape 2/2 ▶",
        nextGridBtn: "Nouvelle Grille ▶",
        winTimedMsg: "Temps : {time} — {bonus}{pgm}",
        withBonus: "Avec bonus",
        withoutBonus: "Sans bonus 🌟",
        pgmReward: " — 🤩 Jackpot PGM : +{count} bonus aléatoires gagnés !",
        pgmNoReward: " — (Bouton Vérifier utilisé : pas de jackpot PGM)",
        winUntimedMsg: "Parfait ! Grille d'apprentissage maîtrisée 🌟",
        adRuleHard: "📺 Regarder une publicité restaure vos <b>4 vies (❤️❤️❤️❤️)</b>.",
        adBtnHard: "📺 Pub : Restaurer 4 Vies",
        adRuleExpert: "⚠️ <b>Règle Mode Expert :</b> Limité à 2 recharges par grille (12 erreurs max).<br>Recharges restantes : <b>{rem} / 2</b>",
        adBtnExpert: "📺 Pub : Restaurer 4 Vies ({rem}/2 restant)",
        adRuleGod: "⚡ <b>Règle Mode Dieu :</b> Limité à 2 recharges et <b>-1 vie régénérée à chaque pub</b> (9 erreurs max).<br>Recharges restantes : <b>{rem} / 2</b>",
        adBtnGod: "📺 Pub : Restaurer {lives} Vies ({rem}/2 restant)",
        adWatchBtn: "📺 Regarder la vidéo",
        adCountdown: "Publicité vidéo en cours... {s}s",
        emptyBonusTitle: "Oh non ! Plus de {name} !",
        emptyBonusDesc: "Vous n'avez plus de <b>{name}</b>.<br><br>Regardez une courte publicité pour obtenir <b>3 bonus aléatoires</b> (dont au moins <b>1 {name} garanti</b>) !",
        bonusRewardToast: "🎁 Récompense : +{b1} {n1}, +{b2} {n2}, +{b3} {n3} !",
        newGridConfirmTitle: "🔄 Nouvelle grille",
        newGridConfirmDesc: "Recommencer ou générer une nouvelle grille d'apprentissage ?",
        newGridAdTitle: "🔄 Générer une nouvelle grille",
        newGridAdDesc: "Regardez une courte publicité pour abandonner la grille actuelle et en générer une nouvelle.<br><small>(Cette grille sera comptabilisée comme abandonnée dans vos statistiques).</small>",
        resetConfirmTitle: "🗑️ Réinitialiser la progression",
        resetConfirmDesc: "Voulez-vous vraiment effacer votre progression et revoir les règles depuis le tutoriel ?",
        resetDoneToast: "Progression réinitialisée.",
        codeInvalid: "❌ Code invalide.",

        // Défi du Jour & Carrousel des Règles
        dailyCheckTitle: "📅 Défi du Jour (5x5)",
        dailyCheckDesc: "Avant de lancer la grille quotidienne, <strong>connaissez-vous déjà les 3 règles de KuroGram</strong> (Sudoku, Murs Nonogram et Sommes Kakuro) ?",
        dailyKnowYes: "✅ Oui, lancer le Défi du Jour ▶",
        dailyKnowNo: "📖 Non, voir les règles illustrées",
        rulesModalTitle: "📖 Les 3 Règles d'Or",
        swipeHint: "Glissez ou utilisez ◀ ▶",
        rulesCloseBtn: "J'ai compris ! Fermer ✕",
        rulesStartTutoBtn: "🎓 Faire le tutoriel guidé (Mode 0)"
    },

    en: {
        streakTitle: "Consecutive days",
        helpTitle: "3 Golden Rules (?)",
        newGridTitle: "New grid",
        dailyTitle: "Daily Challenge",
        menuTitle: "Main Menu",
        toolNum: "✍️ Number",
        toolNote: "✏️ Notes",
        toolWall: "⬛ Wall",
        toolVerify: "✔️ Check",
        createdBy: "Created by",
        saved: "💾 Saved",
        closeEsc: "Close (Esc)",
        cancel: "Cancel",
        confirm: "Confirm",
        validate: "Submit",
        choose: "Select",
        active: "Active",
        equipped: "Equipped",
        dailyHeader: "📅 Daily Challenge (5x5)",
        rulesStepHeader: "Mode 0: Rules (Step {step}/2)",

        tabModes: "⚙️ Modes",
        tabStats: "📊 Stats",
        tabThemes: "🏆 Themes",
        engravedToggle: "Engraved numbers 🔒 inside walls (Modes 0-3)",
        secretPlaceholder: "Supporter / secret code...",
        resetProgressBtn: "🗑️ Reset my progress",
        devToolsTitle: "🛠️ Developer Tools (Test):",
        debugUnlockBtn: "🔓 Unlock All",
        debugResetBtn: "🗑️ Full Reset",
        themesTitle: "Visual Themes",
        achievementsTitle: "Achievements",

        mode0Name: "Mode 0: Rules",
        mode0Desc: "Learn the 3 golden rules step by step (2 steps)",
        mode1Name: "Mode 1: Training",
        mode1Desc: "3x3 & 4x4 grids with smart hints (No timer)",
        mode2Name: "Mode 2: Beginner",
        mode2Desc: "4x4 grids, timer, active bonuses, engraved walls",
        mode3Name: "Mode 3: Hard",
        mode3Desc: "5x5 grids, 4 lives, mistakes penalized",
        mode4Name: "Mode 4: Expert",
        mode4Desc: "5x5 to 9x9 grids, opaque walls, max 2 life ads",
        mode5Name: "Mode 5: God Mode",
        mode5Desc: "5x5 to 9x9 grids, 35% bonus fizzle, decreasing lives",
        mode6Name: "Mode 6: 🤩 PGM",
        mode6Desc: "10x10 to 16x16 Hex grids (10 to 32 bonuses per win!)",
        modeLocked: "Unlocked at {req} solved grids ({cur}/{req})",

        themePaperName: "Notebook & Pencil",
        themePaperCond: "Unlocked by default",
        themePaperB1: "Stamp", themePaperB2: "Quill", themePaperB3: "Pencil",
        themeStoneName: "Board & Stone",
        themeStoneCond: "3-day streak or 5 wins without bonuses",
        themeStoneB1: "Hammer", themeStoneB2: "Chisel", themeStoneB3: "Chalk",
        themeSlateName: "Slate Night & Gold",
        themeSlateCond: "10 flawless wins or 7-day streak",
        themeSlateB1: "Seal", themeSlateB2: "Gold Quill", themeSlateB3: "Astrolabe",

        achPureName: "Pure Mind",
        achPureDesc: "Win 5 grids without bonuses ({cur}/5)",
        achFlawlessName: "Flawless",
        achFlawlessDesc: "10 flawless wins in a row ({cur}/10)",
        achRegularName: "Dedicated",
        achRegularDesc: "Log in 3 days in a row ({cur}/3)",
        achPgmName: "🤩 Hexadecimal PGM Master",
        achPgmUnlockedDesc: "Mode 6: 🤩 PGM (10x10 to 16x16) unlocked",
        achPgmLockedDesc: "Complete five 9x9 grids with no errors or bonuses (or supporter code)",

        statsShowLabel: "Filter:",
        statsGlobalOpt: "🌍 Global (All grids)",
        statsGridOpt: "{sz}x{sz} Grid",
        statsSolved: "Grids Solved ({rate}%)",
        statsBestTime: "Fastest Time",
        statsAvgTime: "Average Time",
        statsWorstTime: "Slowest Time",
        statsStarted: "Grids started:",
        statsAbandoned: "Grids abandoned (🔄):",
        statsLost: "Grids lost (Out of lives):",
        statsLivesUsed: "Lives used / lost:",
        statsNoBonus: "Solved WITHOUT bonus:",
        statsWithBonus: "Solved WITH bonus:",
        statsTotalBonuses: "Total bonuses used:",
        statsFlawless: "Flawless wins (0 errors):",

        tutoStep1WallPlaced: "<strong>Step 1/2:</strong> Great! The <b>Wall ⬛</b> in the middle hides <b><i>2</i> 🔒</b>: this <b>2</b> does <u>not</u> count in the sum <b>1 - 3</b>, but is already used for the Sudoku rule! Now place <b>1</b> on the left and <b>3</b> on the right.",
        tutoStep1Start: "<strong>Step 1/2:</strong> Look at row 1: the clue is <b>1 - 3</b> (two blocks separated by a Wall). Tap the 1st cell and enter <b>1</b>. Tap the middle cell and click <b>⬛ Wall</b>. Tap the 3rd cell and enter <b>3</b>! <i>(Need help? Tap <b>?</b> at the top)</i>.",
        tutoStep2: "<strong>Step 2/2 (3x3 Grid):</strong> Each row/column contains <b>1, 2 and 3</b>. Remember: the number <b>🔒</b> hidden under a <b>Wall ⬛</b> is <u>never</u> added to the edge sums, but still counts for Sudoku uniqueness!",
        hintNoWall: "💡 <b>Tip:</b> Row {r} has a sum of <b>{sum}</b>: it contains <b>no walls</b>!",
        hintSplitSum: "💡 <b>Tip:</b> Row {r} (<b>{clues}</b>): place a <b>⬛ Wall</b> between these sums. The number hidden under a wall doesn't count in the sum, but counts for Sudoku!",
        hintDefault: "💡 <b>Tip:</b> Every number from 1 to {n} appears once per row and column, even when hidden under a Wall ⬛!",

        errNotWall: "That cell is not a wall!",
        errIsWall: "That cell is a wall!",
        errDuplicate: "Number already present in this row or column!",
        errNoLives: "You are out of lives.",
        livesLeftToast: "💔 {msg} ({lives} life/lives left)",
        verifyErrors: "⚠️ {count} cell(s) contain an error (highlighted in red).",
        verifyOkRemaining: "✔️ No errors in your current entries! (<b>{rem} cell(s)</b> left to fill).",
        verifyAllFilled: "✔️ No contradictions found! Check that block sums match the edge clues.",
        allWallsFound: "All walls are already revealed!",
        godModeFizzle: "⚡ God Mode: Your bonus shattered under divine pressure!",

        unlockTitle: "🎉 NEW UNLOCK!",
        unlockModeMsg: "You unlocked <b>{name}</b>!",
        unlockThemeMsg: "New visual theme unlocked: <b>{name}</b>!",
        unlockAchMsg: "Achievement unlocked: <b>🏆 {name}</b>!",

        winTitle: "🎉 Grid Solved!",
        loseTitle: "💔 Game Over",
        step1DoneTitle: "👏 Step 1/2 Complete!",
        step1DoneMsg: "Step 1/2 mastered! Let's move on to Step 2/2 on a full 3x3 grid.",
        nextStepBtn: "Go to Step 2/2 ▶",
        nextGridBtn: "New Grid ▶",
        winTimedMsg: "Time: {time} — {bonus}{pgm}",
        withBonus: "With bonus",
        withoutBonus: "No bonus 🌟",
        pgmReward: " — 🤩 PGM Jackpot: +{count} random bonuses won!",
        pgmNoReward: " — (Check button used: no PGM bonus jackpot)",
        winUntimedMsg: "Perfect! Training grid mastered 🌟",
        adRuleHard: "📺 Watching an ad restores all <b>4 lives (❤️❤️❤️❤️)</b>.",
        adBtnHard: "📺 Ad: Restore 4 Lives",
        adRuleExpert: "⚠️ <b>Expert Mode Rule:</b> Limited to 2 refills per grid (12 errors max).<br>Refills left: <b>{rem} / 2</b>",
        adBtnExpert: "📺 Ad: Restore 4 Lives ({rem}/2 left)",
        adRuleGod: "⚡ <b>God Mode Rule:</b> Limited to 2 refills and <b>-1 life restored per ad</b> (9 errors max).<br>Refills left: <b>{rem} / 2</b>",
        adBtnGod: "📺 Ad: Restore {lives} Lives ({rem}/2 left)",
        adWatchBtn: "📺 Watch video",
        adCountdown: "Video ad playing... {s}s",
        emptyBonusTitle: "Oh no! Out of {name}!",
        emptyBonusDesc: "You have no <b>{name}</b> left.<br><br>Watch a short ad to get <b>3 random bonuses</b> (including at least <b>1 guaranteed {name}</b>)!",
        bonusRewardToast: "🎁 Reward: +{b1} {n1}, +{b2} {n2}, +{b3} {n3}!",
        newGridConfirmTitle: "🔄 New Grid",
        newGridConfirmDesc: "Restart or generate a new training grid?",
        newGridAdTitle: "🔄 Generate a New Grid",
        newGridAdDesc: "Watch a short ad to abandon the current grid and generate a new one.<br><small>(This grid will count as abandoned in your stats).</small>",
        resetConfirmTitle: "🗑️ Reset Progress",
        resetConfirmDesc: "Do you really want to erase your progress and replay the tutorial?",
        resetDoneToast: "Progress reset.",
        codeInvalid: "❌ Invalid code.",

        dailyCheckTitle: "📅 Daily Challenge (5x5)",
        dailyCheckDesc: "Before starting today's puzzle, <strong>do you already know the 3 rules of KuroGram</strong> (Sudoku, Nonogram Walls & Kakuro Sums)?",
        dailyKnowYes: "✅ Yes, start Daily Challenge ▶",
        dailyKnowNo: "📖 No, show illustrated rules",
        rulesModalTitle: "📖 The 3 Golden Rules",
        swipeHint: "Swipe or use ◀ ▶",
        rulesCloseBtn: "Got it! Close ✕",
        rulesStartTutoBtn: "🎓 Play guided tutorial (Mode 0)"
    },

    es: {
        streakTitle: "Días consecutivos",
        helpTitle: "Las 3 Reglas de Oro (?)",
        newGridTitle: "Nueva cuadrícula",
        dailyTitle: "Desafío Diario",
        menuTitle: "Menú Principal",
        toolNum: "✍️ Número",
        toolNote: "✏️ Notas",
        toolWall: "⬛ Muro",
        toolVerify: "✔️ Verificar",
        createdBy: "Creado por",
        saved: "💾 Guardado",
        closeEsc: "Cerrar (Esc)",
        cancel: "Cancelar",
        confirm: "Confirmar",
        validate: "Validar",
        choose: "Elegir",
        active: "Activo",
        equipped: "Equipado",
        dailyHeader: "📅 Desafío Diario (5x5)",
        rulesStepHeader: "Modo 0: Reglas (Paso {step}/2)",

        tabModes: "⚙️ Modos",
        tabStats: "📊 Estad.",
        tabThemes: "🏆 Temas",
        engravedToggle: "Números grabados 🔒 en los muros (Modos 0-3)",
        secretPlaceholder: "Código de donante / secreto...",
        resetProgressBtn: "🗑️ Reiniciar mi progreso",
        devToolsTitle: "🛠️ Herramientas Dev (Test):",
        debugUnlockBtn: "🔓 Desbloquear todo",
        debugResetBtn: "🗑️ Reinicio Total",
        themesTitle: "Temas Visuales",
        achievementsTitle: "Logros",

        mode0Name: "Modo 0: Reglas",
        mode0Desc: "Aprende las 3 reglas de oro paso a paso (2 etapas)",
        mode1Name: "Modo 1: Aprendizaje",
        mode1Desc: "Cuadrículas 3x3 y 4x4 con asistente (Sin reloj)",
        mode2Name: "Modo 2: Principiante",
        mode2Desc: "Cuadrículas 4x4, reloj, bonos activos, muros grabados",
        mode3Name: "Modo 3: Difícil",
        mode3Desc: "Cuadrículas 5x5, 4 vidas, errores penalizados",
        mode4Name: "Modo 4: Experto",
        mode4Desc: "5x5 a 9x9, muros opacos, máx. 2 anuncios de vida",
        mode5Name: "Modo 5: Modo Dios",
        mode5Desc: "5x5 a 9x9, 35% fallo de bono, vidas decrecientes",
        mode6Name: "Modo 6: 🤩 PGM",
        mode6Desc: "10x10 a 16x16 Hexa (¡10 a 32 bonos por victoria!)",
        modeLocked: "Se desbloquea con {req} cuadrículas resueltas ({cur}/{req})",

        themePaperName: "Cuaderno y Lápiz",
        themePaperCond: "Desbloqueado por defecto",
        themePaperB1: "Sello", themePaperB2: "Pluma", themePaperB3: "Lápiz",
        themeStoneName: "Tablero y Piedra",
        themeStoneCond: "3 días seguidos o 5 victorias sin bonos",
        themeStoneB1: "Martillo", themeStoneB2: "Cincel", themeStoneB3: "Tiza",
        themeSlateName: "Noche de Pizarra y Oro",
        themeSlateCond: "10 victorias sin error o 7 días seguidos",
        themeSlateB1: "Sello Real", themeSlateB2: "Pluma Oro", themeSlateB3: "Astrolabio",

        achPureName: "Mente Pura",
        achPureDesc: "Ganar 5 cuadrículas sin bonos ({cur}/5)",
        achFlawlessName: "Infalible",
        achFlawlessDesc: "Racha de 10 cuadrículas sin error ({cur}/10)",
        achRegularName: "Habitual",
        achRegularDesc: "Conéctate 3 días seguidos ({cur}/3)",
        achPgmName: "🤩 Maestro PGM Hexadecimal",
        achPgmUnlockedDesc: "Modo 6: 🤩 PGM (10x10 a 16x16) desbloqueado",
        achPgmLockedDesc: "Completa 5 cuadrículas 9x9 sin errores ni bonos (o código donante)",

        statsShowLabel: "Mostrar:",
        statsGlobalOpt: "🌍 Global (Todas)",
        statsGridOpt: "Cuadrícula {sz}x{sz}",
        statsSolved: "Resueltas ({rate}%)",
        statsBestTime: "Tiempo más rápido",
        statsAvgTime: "Tiempo Medio",
        statsWorstTime: "Tiempo más lento",
        statsStarted: "Cuadrículas iniciadas:",
        statsAbandoned: "Abandonadas (🔄):",
        statsLost: "Perdidas (Sin vidas):",
        statsLivesUsed: "Vidas usadas / perdidas:",
        statsNoBonus: "Resueltas SIN bonos:",
        statsWithBonus: "Resueltas CON bonos:",
        statsTotalBonuses: "Total de bonos usados:",
        statsFlawless: "Victorias sin ningún error:",

        tutoStep1WallPlaced: "<strong>Paso 1/2:</strong> ¡Genial! El <b>Muro ⬛</b> central oculta el <b><i>2</i> 🔒</b>: ese <b>2</b> <u>no</u> suma en <b>1 - 3</b>, ¡pero ya cuenta para el Sudoku! Pon <b>1</b> a la izquierda y <b>3</b> a la derecha.",
        tutoStep1Start: "<strong>Paso 1/2:</strong> Mira la 1.ª fila: la pista es <b>1 - 3</b> (dos bloques separados por un Muro). Toca la 1.ª casilla y pon <b>1</b>. Toca la casilla central y pulsa <b>⬛ Muro</b>. ¡Toca la 3.ª y pon <b>3</b>! <i>(Ayuda: botón <b>?</b> arriba)</i>.",
        tutoStep2: "<strong>Paso 2/2 (3x3):</strong> Cada fila/columna tiene <b>1, 2 y 3</b>. Recuerda: el número <b>🔒</b> bajo un <b>Muro ⬛</b> <u>nunca</u> se suma en los bordes, ¡pero cuenta para la unicidad del Sudoku!",
        hintNoWall: "💡 <b>Pista:</b> La fila {r} suma <b>{sum}</b>: ¡no tiene <b>ningún muro</b>!",
        hintSplitSum: "💡 <b>Pista:</b> Fila {r} (<b>{clues}</b>): coloca un <b>⬛ Muro</b> entre estas sumas. ¡El número oculto bajo el muro no suma, pero cuenta para el Sudoku!",
        hintDefault: "💡 <b>Pista:</b> ¡Cada número del 1 al {n} es único por fila y columna, incluso oculto bajo un Muro ⬛!",

        errNotWall: "¡Esa casilla no es un muro!",
        errIsWall: "¡Esa casilla es un muro!",
        errDuplicate: "¡Número ya presente en la fila o columna!",
        errNoLives: "Te has quedado sin vidas.",
        livesLeftToast: "💔 {msg} ({lives} vida(s) restante(s))",
        verifyErrors: "⚠️ {count} casilla(s) tienen error (en rojo).",
        verifyOkRemaining: "✔️ ¡Sin errores actuales! (Faltan <b>{rem} casilla(s)</b> por completar).",
        verifyAllFilled: "✔️ ¡Sin contradicciones! Verifica que las sumas coincidan con los bordes.",
        allWallsFound: "¡Todos los muros ya están descubiertos!",
        godModeFizzle: "⚡ Modo Dios: ¡Tu bono se rompió bajo la presión divina!",

        unlockTitle: "🎉 ¡NUEVO DESBLOQUEO!",
        unlockModeMsg: "¡Has desbloqueado <b>{name}</b>!",
        unlockThemeMsg: "¡Nuevo tema desbloqueado: <b>{name}</b>!",
        unlockAchMsg: "¡Logro completado: <b>🏆 {name}</b>!",

        winTitle: "🎉 ¡Cuadrícula Resuelta!",
        loseTitle: "💔 Partida Terminada",
        step1DoneTitle: "👏 ¡Paso 1/2 Completado!",
        step1DoneMsg: "¡Paso 1/2 superado! Pasemos al Paso 2/2 en una cuadrícula 3x3 completa.",
        nextStepBtn: "Ir al Paso 2/2 ▶",
        nextGridBtn: "Nueva Cuadrícula ▶",
        winTimedMsg: "Tiempo: {time} — {bonus}{pgm}",
        withBonus: "Con bonos",
        withoutBonus: "Sin bonos 🌟",
        pgmReward: " — 🤩 Bote PGM: ¡+{count} bonos aleatorios ganados!",
        pgmNoReward: " — (Botón Verificar usado: sin bote PGM)",
        winUntimedMsg: "¡Perfecto! Cuadrícula de aprendizaje dominada 🌟",
        adRuleHard: "📺 Ver un anuncio restaura tus <b>4 vidas (❤️❤️❤️❤️)</b>.",
        adBtnHard: "📺 Anuncio: Restaurar 4 Vidas",
        adRuleExpert: "⚠️ <b>Regla Modo Experto:</b> Máximo 2 recargas por cuadrícula (12 errores máx).<br>Recargas restantes: <b>{rem} / 2</b>",
        adBtnExpert: "📺 Anuncio: Restaurar 4 Vidas ({rem}/2 rest.)",
        adRuleGod: "⚡ <b>Regla Modo Dios:</b> Máximo 2 recargas y <b>-1 vida por anuncio</b> (9 errores máx).<br>Recargas restantes: <b>{rem} / 2</b>",
        adBtnGod: "📺 Anuncio: Restaurar {lives} Vidas ({rem}/2 rest.)",
        adWatchBtn: "📺 Ver vídeo",
        adCountdown: "Anuncio en curso... {s}s",
        emptyBonusTitle: "¡Oh no! ¡Sin {name}!",
        emptyBonusDesc: "No te quedan <b>{name}</b>.<br><br>¡Mira un breve anuncio para obtener <b>3 bonos aleatorios</b> (con al menos <b>1 {name} garantizado</b>)!",
        bonusRewardToast: "🎁 Recompensa: +{b1} {n1}, +{b2} {n2}, +{b3} {n3}!",
        newGridConfirmTitle: "🔄 Nueva cuadrícula",
        newGridConfirmDesc: "¿Reiniciar o generar una nueva cuadrícula de aprendizaje?",
        newGridAdTitle: "🔄 Generar nueva cuadrícula",
        newGridAdDesc: "Mira un breve anuncio para abandonar la cuadrícula actual y generar una nueva.<br><small>(Contará como abandonada en tus estadísticas).</small>",
        resetConfirmTitle: "🗑️ Reiniciar progreso",
        resetConfirmDesc: "¿Seguro que quieres borrar tu progreso y volver al tutorial?",
        resetDoneToast: "Progreso reiniciado.",
        codeInvalid: "❌ Código inválido.",

        dailyCheckTitle: "📅 Desafío Diario (5x5)",
        dailyCheckDesc: "Antes de empezar el desafío de hoy, <strong>¿conoces ya las 3 reglas de KuroGram</strong> (Sudoku, Muros Nonogram y Sumas Kakuro)?",
        dailyKnowYes: "✅ Sí, jugar el Desafío Diario ▶",
        dailyKnowNo: "📖 No, ver las reglas ilustradas",
        rulesModalTitle: "📖 Las 3 Reglas de Oro",
        swipeHint: "Desliza o usa ◀ ▶",
        rulesCloseBtn: "¡Entendido! Cerrar ✕",
        rulesStartTutoBtn: "🎓 Hacer el tutorial guiado (Modo 0)"
    }
};

// Contenu HTML illustré des 3 diapositives du carrousel selon la langue
const RULES_SLIDES_HTML = {
    fr: [
        `<div class="rule-badge">Règle 1 / 3 — L'ADN du Sudoku</div>
         <h3>Unicité des chiffres (même sous un Mur !)</h3>
         <p class="rule-desc">Sur une grille de 4 cases, chaque ligne et colonne contient <strong>1, 2, 3 et 4 une seule fois</strong>.<br>⚠️ <strong>Important :</strong> Un <strong>Mur noir ⬛ cache toujours un chiffre</strong> ! Ce chiffre masqué compte pour le Sudoku et ne peut plus être remis ailleurs sur la ligne ou colonne.</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECT : 1, 2, 3 et 4 sont présents une seule fois</div>
             <div class="mini-row"><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Le <b>2 🔒</b> est caché sous le mur : les cases blanches utilisent donc <b>1, 3 et 4</b>.</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECT : Le chiffre 2 est utilisé deux fois !</div>
             <div class="mini-row"><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile mini-err">2</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Interdit : le <b>2</b> est déjà sous le mur, on ne peut pas le remettre dans une case blanche.</div>
         </div>`,
        `<div class="rule-badge">Règle 2 / 3 — L'ADN du Nonogram</div>
         <h3>Les Murs noirs découpent la grille</h3>
         <p class="rule-desc">Les <strong>Murs noirs ⬛</strong> séparent les cases blanches en plusieurs blocs.<br>Si l'indice affiche <strong>deux nombres</strong> (ex : <b>1 - 7</b>), il y a <strong>obligatoirement au moins un Mur ⬛</strong> entre les deux blocs blancs.</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECT : Le mur sépare les deux blocs de « 1 - 7 »</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">1er bloc blanc (<b>1</b>), puis un <b>Mur ⬛</b>, puis 2e bloc blanc (<b>3 et 4</b>).</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECT : Aucun mur ne sépare les deux blocs !</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile mini-err">1</div><div class="mini-tile mini-err">3</div><div class="mini-tile mini-err">4</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div></div>
             <div class="ex-caption">Interdit : les cases blanches se touchent (cela ferait un seul bloc de somme 8 au lieu de <b>1 - 7</b>).</div>
         </div>`,
        `<div class="rule-badge">Règle 3 / 3 — L'ADN du Kakuro</div>
         <h3>Les Sommes (Le Mur ne s'additionne jamais !)</h3>
         <p class="rule-desc">Les indices sur les bords indiquent <strong>la somme des cases blanches</strong> de chaque bloc.<br>⚠️ <strong>Règle clé :</strong> Le chiffre caché sous un <strong>Mur ⬛ ne compte JAMAIS dans la somme</strong> (il vaut 0 pour l'addition, mais compte pour le Sudoku !).</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECT : Seules les cases blanches sont additionnées</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Bloc gauche = <b>1</b>. Le mur (<b>2🔒</b>) est ignoré. Bloc droit = <b>3 + 4 = 7</b> !</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECT : Le chiffre du mur a été compté dans la somme</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>4</span><small>🔒</small></div><div class="mini-tile mini-err">3</div><div class="mini-tile mini-err">2</div></div>
             <div class="ex-caption">Erreur : les cases blanches de droite font <b>3 + 2 = 5</b> (et non 7). Le <b>4🔒</b> ne s'additionne jamais !</div>
         </div>`
    ],
    en: [
        `<div class="rule-badge">Rule 1 / 3 — Sudoku DNA</div>
         <h3>Unique Numbers (Even under a Wall!)</h3>
         <p class="rule-desc">On a 4x4 grid, each row and column contains <strong>1, 2, 3 and 4 only once</strong>.<br>⚠️ <strong>Important:</strong> A <strong>black Wall ⬛ always hides a number</strong>! That hidden number counts for Sudoku and cannot be placed again in the same row or column.</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECT: 1, 2, 3 and 4 each appear once</div>
             <div class="mini-row"><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">The <b>2 🔒</b> is hidden inside the wall, so white cells use <b>1, 3 and 4</b>.</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECT: Number 2 is used twice!</div>
             <div class="mini-row"><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile mini-err">2</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Forbidden: <b>2</b> is already hidden under the wall, so it cannot appear in a white cell.</div>
         </div>`,
        `<div class="rule-badge">Rule 2 / 3 — Nonogram DNA</div>
         <h3>Black Walls Split the Grid</h3>
         <p class="rule-desc"><strong>Black Walls ⬛</strong> split white cells into separate blocks.<br>If the edge clue shows <strong>two numbers</strong> (e.g. <b>1 - 7</b>), there must be <strong>at least one Wall ⬛</strong> between the two white blocks.</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECT: The wall separates the two blocks of "1 - 7"</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">1st white block (<b>1</b>), then a <b>Wall ⬛</b>, then 2nd white block (<b>3 and 4</b>).</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECT: No wall separates the two blocks!</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile mini-err">1</div><div class="mini-tile mini-err">3</div><div class="mini-tile mini-err">4</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div></div>
             <div class="ex-caption">Forbidden: all white cells touch each other (making a single block of sum 8 instead of <b>1 - 7</b>).</div>
         </div>`,
        `<div class="rule-badge">Rule 3 / 3 — Kakuro DNA</div>
         <h3>Block Sums (Walls Never Add Up!)</h3>
         <p class="rule-desc">Edge clues indicate <strong>the sum of white cells</strong> in each block.<br>⚠️ <strong>Key rule:</strong> The number hidden under a <strong>Wall ⬛ NEVER counts in the sum</strong> (it adds 0 to the sum, even though it counts for Sudoku!).</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECT: Only white cells are added together</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Left block = <b>1</b>. Wall (<b>2🔒</b>) is ignored. Right block = <b>3 + 4 = 7</b>!</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECT: The wall's hidden number was added to the sum</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>4</span><small>🔒</small></div><div class="mini-tile mini-err">3</div><div class="mini-tile mini-err">2</div></div>
             <div class="ex-caption">Error: the right white cells equal <b>3 + 2 = 5</b> (not 7). The <b>4🔒</b> under the wall never adds up!</div>
         </div>`
    ],
    es: [
        `<div class="rule-badge">Regla 1 / 3 — ADN del Sudoku</div>
         <h3>Números únicos (¡Incluso bajo un Muro!)</h3>
         <p class="rule-desc">En una cuadrícula de 4 casillas, cada fila y columna contiene <strong>1, 2, 3 y 4 una sola vez</strong>.<br>⚠️ <strong>Importante:</strong> ¡Un <strong>Muro negro ⬛ siempre oculta un número</strong>! Ese número cuenta para el Sudoku y no puede repetirse en la fila o columna.</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECTO: 1, 2, 3 y 4 están presentes una sola vez</div>
             <div class="mini-row"><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">El <b>2 🔒</b> está oculto bajo el muro: las casillas blancas usan <b>1, 3 y 4</b>.</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECTO: ¡El número 2 está repetido!</div>
             <div class="mini-row"><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile mini-err">2</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Prohibido: el <b>2</b> ya está bajo el muro, no puede ponerse en una casilla blanca.</div>
         </div>`,
        `<div class="rule-badge">Regla 2 / 3 — ADN del Nonogram</div>
         <h3>Los Muros negros dividen la cuadrícula</h3>
         <p class="rule-desc">Los <strong>Muros negros ⬛</strong> separan las casillas blancas en bloques.<br>Si la pista muestra <strong>dos números</strong> (ej: <b>1 - 7</b>), debe haber <strong>al menos un Muro ⬛</strong> entre los dos bloques blancos.</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECTO: El muro separa los dos bloques de « 1 - 7 »</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">1.er bloque blanco (<b>1</b>), luego un <b>Muro ⬛</b>, luego 2.º bloque blanco (<b>3 y 4</b>).</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECTO: ¡Ningún muro separa los bloques!</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile mini-err">1</div><div class="mini-tile mini-err">3</div><div class="mini-tile mini-err">4</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div></div>
             <div class="ex-caption">Prohibido: las casillas blancas se tocan (formando un solo bloque de suma 8 en vez de <b>1 - 7</b>).</div>
         </div>`,
        `<div class="rule-badge">Regla 3 / 3 — ADN del Kakuro</div>
         <h3>Las Sumas (¡El Muro nunca se suma!)</h3>
         <p class="rule-desc">Las pistas en los bordes indican <strong>la suma de las casillas blancas</strong> de cada bloque.<br>⚠️ <strong>Regla clave:</strong> El número oculto bajo un <strong>Muro ⬛ NUNCA cuenta en la suma</strong> (vale 0 para la suma, ¡pero cuenta para el Sudoku!).</p>
         <div class="example-box ex-good">
             <div class="ex-title">✅ CORRECTO: Solo se suman las casillas blancas</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>2</span><small>🔒</small></div><div class="mini-tile">3</div><div class="mini-tile">4</div></div>
             <div class="ex-caption">Bloque izq. = <b>1</b>. El muro (<b>2🔒</b>) se ignora. Bloque der. = <b>3 + 4 = 7</b>!</div>
         </div>
         <div class="example-box ex-bad">
             <div class="ex-title">❌ INCORRECTO: El número del muro fue contado en la suma</div>
             <div class="mini-row"><div class="mini-clue">1 - 7</div><div class="mini-tile">1</div><div class="mini-tile mini-wall"><span>4</span><small>🔒</small></div><div class="mini-tile mini-err">3</div><div class="mini-tile mini-err">2</div></div>
             <div class="ex-caption">Error: las blancas derechas suman <b>3 + 2 = 5</b> (no 7). ¡El <b>4🔒</b> del muro nunca se suma!</div>
         </div>`
    ]
};

function detectDefaultLang() {
    const saved = localStorage.getItem('kurogram_lang');
    if (saved && I18N[saved]) return saved;
    const nav = (navigator.language || 'fr').slice(0, 2).toLowerCase();
    return I18N[nav] ? nav : 'fr';
}

let currentLang = detectDefaultLang();

function t(key, vars = {}) {
    const dict = I18N[currentLang] || I18N.fr;
    let str = dict[key] ?? I18N.fr[key] ?? key;
    Object.keys(vars).forEach(k => {
        str = str.replaceAll(`{${k}}`, vars[k]);
    });
    return str;
}