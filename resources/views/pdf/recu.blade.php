<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Reçu de paiement</title>
    <style>
        @page {
            margin: 30px 40px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #222;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }

        .header img {
            height: 60px;
            margin-bottom: 5px;
        }

        .header h2 {
            margin: 0;
            font-size: 18px;
        }

        .header p {
            margin: 0;
            font-size: 12px;
        }

        .section {
            margin-bottom: 15px;
        }

        .section-title {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 13px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 5px;
            padding-bottom: 3px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th,
        td {
            padding: 6px;
            text-align: left;
            vertical-align: middle;
        }

        th {
            background: #f3f3f3;
            border-bottom: 1px solid #ccc;
            font-size: 12px;
        }

        td {
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }

        .summary-table {
            width: 60%;
            margin-top: 10px;
        }

        .summary-table td {
            padding: 5px;
        }

        .highlight {
            font-weight: bold;
            font-size: 13px;
        }

        .right {
            text-align: right;
        }

        .footer {
            text-align: center;
            font-size: 10px;
            margin-top: 20px;
            border-top: 1px solid #ccc;
            padding-top: 8px;
        }

        .signature {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
        }

        .signature div {
            width: 45%;
            text-align: center;
        }
    </style>
</head>

<body>
    <!-- ✅ En-tête -->
    <div class="header">
        @if(file_exists($schoolInfo['logo']))
        <img src="{{ $schoolInfo['logo'] }}" alt="Logo École">
        @endif
        <h2>{{ $schoolInfo['nom'] }}</h2>
        <p>{{ $schoolInfo['adresse'] }} | Tél: {{ $schoolInfo['telephone'] }}</p>
    </div>

    <!-- 🧾 Titre -->
    <div style="text-align:center; margin-bottom:10px;">
        <h3 style="margin:0; text-transform:uppercase;">Reçu de Paiement</h3>
        <p style="margin:0;">{{ $paiement->date_paiement->format('d/m/Y') }}</p>
    </div>

    <!-- 👤 Informations Élève -->
    <div class="section">
        <div class="section-title">Informations de l'élève</div>
        <table>
            <tr>
                <td><strong>Élève :</strong> {{ $facture->eleve_nom }}</td>
                <td><strong>Classe :</strong> {{ $facture->classe_nom }}</td>
            </tr>
            <tr>
                <td><strong>Niveau :</strong> {{ $facture->niveau_nom }}</td>
                <td><strong>Cycle :</strong> {{ $facture->cycle_nom ?? '—' }}</td>
            </tr>
            <tr>
                <td><strong>Mois concerné :</strong> {{ str_pad($facture->mois, 2, '0', STR_PAD_LEFT) }}/{{ $facture->annee }}</td>
                <td><strong>Facture # :</strong> {{ $facture->id }}</td>
            </tr>
        </table>
    </div>

    <!-- 💸 Détails du paiement -->
    <div class="section">
        <div class="section-title">Détails du paiement</div>
        <table>
            <tr>
                <td><strong>Montant payé :</strong></td>
                <td class="highlight right">{{ number_format($paiement->montant, 0, ',', ' ') }} F CFA</td>
            </tr>
            <tr>
                <td><strong>Mode de paiement :</strong></td>
                <td class="right">{{ ucfirst($paiement->mode) }}</td>
            </tr>
            <tr>
                <td><strong>Référence :</strong></td>
                <td class="right">{{ $paiement->reference ?? '—' }}</td>
            </tr>
        </table>
    </div>

    <!-- 🧾 Récapitulatif facture -->
    <div class="section">
        <div class="section-title">Récapitulatif de la facture</div>
        <table>
            <thead>
                <tr>
                    <th>Service</th>
                    <th class="right">Montant (F CFA)</th>
                </tr>
            </thead>
            <tbody>
                @foreach($facture->details as $detail)
                <tr>
                    <td>{{ $detail->service_nom }}</td>
                    <td class="right">{{ number_format($detail->montant, 0, ',', ' ') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <table class="summary-table" align="right">
            <tr>
                <td><strong>Total facture :</strong></td>
                <td class="right">{{ number_format($facture->montant_total, 0, ',', ' ') }} F CFA</td>
            </tr>
            <tr>
                <td><strong>Montant payé :</strong></td>
                <td class="right">{{ number_format($facture->montant_paye, 0, ',', ' ') }} F CFA</td>
            </tr>
            <tr>
                <td><strong>Montant restant :</strong></td>
                <td class="right">{{ number_format($facture->montant_restant, 0, ',', ' ') }} F CFA</td>
            </tr>
        </table>
    </div>

    <!-- ✍️ Signatures -->
    <div class="signature">
        <div>
            <p><strong>Caissier(e)</strong></p>
            <p>______________________</p>
        </div>
        <div>
            <p><strong>Parent / Tuteur</strong></p>
            <p>______________________</p>
        </div>
    </div>

    <!-- ⚙️ Pied de page -->
    <div class="footer">
        <p>Ce reçu confirme la réception du paiement ci-dessus pour le compte de l'école {{ $schoolInfo['nom'] }}.</p>
        <p>Généré le {{ now()->format('d/m/Y H:i') }}</p>
    </div>
</body>

</html>