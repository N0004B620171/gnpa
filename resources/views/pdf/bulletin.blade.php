@php
use Carbon\Carbon;

// Langue courante du bulletin
$lang = $bulletin->langue ?? 'fr';

// Dictionnaire trilingue
$T = [
    'fr' => [
        'title' => $bulletin->annuel ? 'Bulletin Annuel' : 'Bulletin Trimestriel',
        'school' => 'École',
        'student' => 'Élève',
        'class' => 'Classe',
        'level' => 'Niveau',
        'teacher' => 'Professeur principal',
        'year' => 'Année scolaire',
        'date' => 'Date d’émission',
        'subject' => 'Matière',
        'coef' => 'Coeff',
        'note' => 'Note',
        'on' => 'Sur',
        'note20' => 'Note / 20',
        'appreciation' => 'Appréciation',
        'no_note' => 'Aucune note enregistrée pour ce bulletin',
        'average' => 'Moyenne',
        'rank' => 'Rang',
        'class_average' => 'Moyenne de la classe',
        'remarks' => 'Appréciation générale',
        'footer' => 'Fait à',
        'director' => 'Le Directeur',
        'excellent' => 'Excellent travail.',
        'very_good' => 'Très bon trimestre, continuez ainsi.',
        'good' => 'Bon travail, quelques efforts à fournir.',
        'average_perf' => 'Moyenne obtenue, peut mieux faire.',
        'bad' => 'Résultats insuffisants, redoublez d’efforts.',
        'no_avg' => 'Pas encore de moyenne calculée.'
    ],
    'en' => [
        'title' => $bulletin->annuel ? 'Annual Report Card' : 'Term Report Card',
        'school' => 'School',
        'student' => 'Student',
        'class' => 'Class',
        'level' => 'Level',
        'teacher' => 'Class Teacher',
        'year' => 'School Year',
        'date' => 'Issue Date',
        'subject' => 'Subject',
        'coef' => 'Coef',
        'note' => 'Score',
        'on' => 'Out of',
        'note20' => 'Normalized / 20',
        'appreciation' => 'Comment',
        'no_note' => 'No grades recorded for this report card',
        'average' => 'Average',
        'rank' => 'Rank',
        'class_average' => 'Class Average',
        'remarks' => 'General Remarks',
        'footer' => 'Issued in',
        'director' => 'Principal',
        'excellent' => 'Excellent work.',
        'very_good' => 'Very good term, keep it up.',
        'good' => 'Good work, a few efforts needed.',
        'average_perf' => 'Average performance, can improve.',
        'bad' => 'Insufficient results, needs improvement.',
        'no_avg' => 'No average calculated yet.'
    ],
    'ar' => [
        'title' => $bulletin->annuel ? 'التقرير السنوي' : 'تقرير الفصل الدراسي',
        'school' => 'المدرسة',
        'student' => 'الطالب',
        'class' => 'القسم',
        'level' => 'المستوى',
        'teacher' => 'الأستاذ الرئيسي',
        'year' => 'السنة الدراسية',
        'date' => 'تاريخ الإصدار',
        'subject' => 'المادة',
        'coef' => 'المعامل',
        'note' => 'النتيجة',
        'on' => 'من',
        'note20' => 'النتيجة / 20',
        'appreciation' => 'الملاحظة',
        'no_note' => 'لا توجد نتائج لهذا التقرير',
        'average' => 'المعدل',
        'rank' => 'الترتيب',
        'class_average' => 'معدل القسم',
        'remarks' => 'ملاحظة عامة',
        'footer' => 'حرر في',
        'director' => 'المدير',
        'excellent' => 'عمل ممتاز.',
        'very_good' => 'فصل جيد جدًا، استمر.',
        'good' => 'عمل جيد، بعض الجهود مطلوبة.',
        'average_perf' => 'مستوى متوسط، يمكن التحسن.',
        'bad' => 'نتائج غير كافية، تحتاج إلى مزيد من الجهد.',
        'no_avg' => 'لم يتم حساب المعدل بعد.'
    ],
];

// Texte dynamique selon la langue
$t = $T[$lang];
$rtl = $lang === 'ar';
@endphp

<!DOCTYPE html>
<html lang="{{ $lang }}" dir="{{ $rtl ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <title>{{ $t['title'] }} - {{ $bulletin->eleve_nom }}</title>
    <style>
        body {
            font-family: "DejaVu Sans", sans-serif;
            font-size: 12px;
            direction: {{ $rtl ? 'rtl' : 'ltr' }};
            text-align: {{ $rtl ? 'right' : 'left' }};
            color: #222;
            margin: 25px;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }

        .header .school-name {
            font-size: 18px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .title {
            text-align: center;
            margin: 15px 0;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
            border: 1px solid #333;
            padding: 6px;
            background-color: #f7f7f7;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        table td, table th {
            padding: 6px;
            border: 1px solid #999;
            text-align: center;
        }

        table th {
            background-color: #efefef;
        }

        .average-box {
            text-align: center;
            border: 1px solid #000;
            padding: 8px;
            font-size: 14px;
            font-weight: bold;
            background: #f8f8f8;
            width: 220px;
            margin: 10px auto;
        }

        .remarks {
            border: 1px solid #ccc;
            padding: 8px;
            font-style: italic;
            background: #fdfdfd;
        }

        .footer {
            margin-top: 20px;
            font-size: 11px;
        }

        .footer .left, .footer .right {
            width: 50%;
            display: inline-block;
            vertical-align: top;
        }

        .footer .right {
            text-align: {{ $rtl ? 'left' : 'right' }};
        }

        .logo {
            width: 80px;
            height: auto;
            position: absolute;
            top: 20px;
            {{ $rtl ? 'right' : 'left' }}: 20px;
        }
    </style>
</head>
<body>

    {{-- Logo --}}
    @if(file_exists($schoolInfo['logo']))
        <img src="{{ $schoolInfo['logo'] }}" alt="Logo" class="logo">
    @endif

    {{-- En-tête --}}
    <div class="header">
        <div class="school-name">{{ strtoupper($schoolInfo['nom']) }}</div>
        <div>{{ $schoolInfo['adresse'] }} — {{ $schoolInfo['telephone'] }}</div>
    </div>

    {{-- Titre --}}
    <div class="title">
        {{ $t['title'] }} – {{ $bulletin->trimestre_nom }} ({{ $bulletin->annee_scolaire_nom }})
    </div>

    {{-- Infos élève --}}
    <table>
        <tr>
            <td><strong>{{ $t['student'] }} :</strong> {{ $bulletin->eleve_nom }}</td>
            <td><strong>{{ $t['class'] }} :</strong> {{ $bulletin->classe_nom }}</td>
        </tr>
        <tr>
            <td><strong>{{ $t['level'] }} :</strong> {{ $bulletin->niveau_nom }}</td>
            <td><strong>{{ $t['teacher'] }} :</strong> {{ $bulletin->professeur_nom ?? '-' }}</td>
        </tr>
        <tr>
            <td><strong>{{ $t['year'] }} :</strong> {{ $bulletin->annee_scolaire_nom }}</td>
            <td><strong>{{ $t['date'] }} :</strong> {{ Carbon::now()->format('d/m/Y') }}</td>
        </tr>
    </table>

    {{-- Tableau des notes --}}
    <table>
        <thead>
            <tr>
                <th>{{ $t['subject'] }}</th>
                <th>{{ $t['coef'] }}</th>
                <th>{{ $t['note'] }}</th>
                <th>{{ $t['on'] }}</th>
                <th>{{ $t['note20'] }}</th>
                <th>{{ $t['appreciation'] }}</th>
            </tr>
        </thead>
        <tbody>
            @forelse($bulletin->details as $detail)
                <tr>
                    <td>{{ $detail->matiere_nom }}</td>
                    <td>{{ $detail->coefficient }}</td>
                    <td>{{ $detail->note ?? '-' }}</td>
                    <td>{{ $detail->sur ?? 20 }}</td>
                    <td>{{ $detail->note_normalisee ?? '-' }}</td>
                    <td>{{ $detail->appreciation ?? '' }}</td>
                </tr>
            @empty
                <tr><td colspan="6">{{ $t['no_note'] }}</td></tr>
            @endforelse
        </tbody>
    </table>

    {{-- Moyennes --}}
    <div class="average-box">
        {{ $t['average'] }} : {{ $bulletin->moyenne_eleve ?? '-' }} / 20<br>
        {{ $t['rank'] }} : {{ $bulletin->rang ?? '-' }}<br>
        {{ $t['class_average'] }} : {{ $bulletin->moyenne_classe ?? '-' }}
    </div>

    {{-- Appréciation générale --}}
    <div class="remarks">
        <strong>{{ $t['remarks'] }} :</strong>
        @if($bulletin->moyenne_eleve)
            @if($bulletin->moyenne_eleve >= 16)
                {{ $t['excellent'] }}
            @elseif($bulletin->moyenne_eleve >= 14)
                {{ $t['very_good'] }}
            @elseif($bulletin->moyenne_eleve >= 12)
                {{ $t['good'] }}
            @elseif($bulletin->moyenne_eleve >= 10)
                {{ $t['average_perf'] }}
            @else
                {{ $t['bad'] }}
            @endif
        @else
            {{ $t['no_avg'] }}
        @endif
    </div>

    {{-- Pied de page --}}
    <div class="footer">
        <div class="left">
            {{ $t['footer'] }} {{ config('app.school_address', 'Thiès') }},
            {{ Carbon::now()->format('d/m/Y') }}
        </div>
        <div class="right">
            <strong>{{ $t['director'] }} :</strong> {{ $schoolInfo['directeur'] }}
        </div>
    </div>

</body>
</html>
