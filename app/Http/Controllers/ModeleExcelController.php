<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ModeleExcelController extends Controller
{
    /**
     * Télécharger le modèle Excel pour l'import des élèves
     */
    public function telechargerModeleEleves(): StreamedResponse
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Titre
        $sheet->setTitle('Modèle Import Élèves');

        // En-têtes avec style
        $headers = [
            'A1' => 'Prénom élève',
            'B1' => 'Nom élève', 
            'C1' => 'Date de naissance',
            'D1' => 'Sexe',
            'E1' => 'Prénom parent',
            'F1' => 'Nom parent',
            'G1' => 'Email parent',
            'H1' => 'Téléphone parent'
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style des en-têtes
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4F46E5']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ];

        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);

        // Données d'exemple
        $exemples = [
            ['Marie', 'Dupont', '15/03/2015', 'F', 'Sophie', 'Dupont', 'sophie.dupont@email.com', '0123456789'],
            ['Jean', 'Martin', '22/07/2014', 'M', 'Pierre', 'Martin', 'pierre.martin@email.com', '0987654321'],
            ['Léa', 'Bernard', '10/11/2015', 'F', 'Isabelle', 'Bernard', 'isabelle.bernard@email.com', '0612345678'],
            ['', '', '', '', '', '', '', ''], // Ligne vide pour démonstration
        ];

        $row = 2;
        foreach ($exemples as $ligne) {
            $sheet->setCellValue('A' . $row, $ligne[0]);
            $sheet->setCellValue('B' . $row, $ligne[1]);
            $sheet->setCellValue('C' . $row, $ligne[2]);
            $sheet->setCellValue('D' . $row, $ligne[3]);
            $sheet->setCellValue('E' . $row, $ligne[4]);
            $sheet->setCellValue('F' . $row, $ligne[5]);
            $sheet->setCellValue('G' . $row, $ligne[6]);
            $sheet->setCellValue('H' . $row, $ligne[7]);
            $row++;
        }

        // Style des données
        $dataStyle = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'DDDDDD']
                ]
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_LEFT,
            ]
        ];

        $sheet->getStyle('A2:H' . ($row - 1))->applyFromArray($dataStyle);

        // Largeur des colonnes
        $sheet->getColumnDimension('A')->setWidth(15);
        $sheet->getColumnDimension('B')->setWidth(15);
        $sheet->getColumnDimension('C')->setWidth(18);
        $sheet->getColumnDimension('D')->setWidth(10);
        $sheet->getColumnDimension('E')->setWidth(15);
        $sheet->getColumnDimension('F')->setWidth(15);
        $sheet->getColumnDimension('G')->setWidth(25);
        $sheet->getColumnDimension('H')->setWidth(15);

        // Ajouter des commentaires/instructions
        $sheet->setCellValue('A10', 'Instructions :');
        $sheet->setCellValue('A11', '- Les colonnes Prénom élève et Nom élève sont obligatoires');
        $sheet->setCellValue('A12', '- Format date: JJ/MM/AAAA (ex: 15/03/2015)');
        $sheet->setCellValue('A13', '- Sexe: M (Masculin) ou F (Féminin)');
        $sheet->setCellValue('A14', '- Les informations parents sont optionnelles');
        $sheet->setCellValue('A15', '- Supprimez les lignes d\'exemple avant de remplir vos données');

        // Style des instructions
        $instructionStyle = [
            'font' => [
                'italic' => true,
                'color' => ['rgb' => '666666']
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'F3F4F6']
            ]
        ];

        $sheet->getStyle('A10:A15')->applyFromArray($instructionStyle);

        // Validation des données pour la colonne Sexe
        $validation = $sheet->getDataValidation('D2:D1000');
        $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
        $validation->setAllowBlank(true);
        $validation->setShowInputMessage(true);
        $validation->setShowErrorMessage(true);
        $validation->setShowDropDown(true);
        $validation->setErrorTitle('Erreur de saisie');
        $validation->setError('La valeur doit être M ou F');
        $validation->setPromptTitle('Sexe');
        $validation->setPrompt('Sélectionnez M pour Masculin ou F pour Féminin');
        $validation->setFormula1('"M,F"');

        // Créer le fichier
        $writer = new Xlsx($spreadsheet);
        
        $response = new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        });

        $response->headers->set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        $response->headers->set('Content-Disposition', 'attachment;filename="modele_import_eleves.xlsx"');
        $response->headers->set('Cache-Control', 'max-age=0');

        return $response;
    }
}