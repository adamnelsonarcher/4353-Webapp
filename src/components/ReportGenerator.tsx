'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface VolunteerEvent {
  volunteerName: string;
  volunteerEmail: string;
  eventName: string;
  date: string;
}

export default function ReportGenerator() {
  const [loading, setLoading] = useState(false);

  const fetchVolunteerData = async () => {
    try {
      const email = localStorage.getItem('organizationEmail');
      const response = await fetch('/api/organization/volunteer-data', {
        headers: {
          'x-user-email': email || ''
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch volunteer data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching volunteer data:', error);
      throw error;
    }
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      const data = await fetchVolunteerData();
      
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Volunteer Participation Report', 20, 20);
      
      // Group data by volunteer
      const volunteerMap = new Map();
      data.forEach((entry: VolunteerEvent) => {
        if (!volunteerMap.has(entry.volunteerEmail)) {
          volunteerMap.set(entry.volunteerEmail, {
            name: entry.volunteerName,
            email: entry.volunteerEmail,
            events: []
          });
        }
        volunteerMap.get(entry.volunteerEmail).events.push({
          name: entry.eventName,
          date: new Date(entry.date).toLocaleDateString()
        });
      });

      let yPos = 40;
      volunteerMap.forEach((volunteer, email) => {
        // Add new page if needed
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.text(`Name: ${volunteer.name}`, 20, yPos);
        doc.text(`Email: ${email}`, 20, yPos + 7);
        doc.text('Events Participated:', 20, yPos + 14);
        
        volunteer.events.forEach((event: any, index: number) => {
          doc.text(`- ${event.name} (${event.date})`, 25, yPos + 21 + (index * 7));
        });

        yPos += 35 + (volunteer.events.length * 7);
      });

      doc.save('volunteer-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = async () => {
    try {
      setLoading(true);
      const data = await fetchVolunteerData();
      
      // Create CSV content
      const headers = ['Name', 'Email', 'Event', 'Date'];
      const rows = data.map((entry: VolunteerEvent) => [
        entry.volunteerName,
        entry.volunteerEmail,
        entry.eventName,
        new Date(entry.date).toLocaleDateString()
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row: string[]) => row.join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'volunteer-report.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Failed to generate CSV report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Report Generation</h2>
      <div className="flex gap-4">
        <Button
          onClick={generatePDF}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Generating...' : 'Generate PDF Report'}
        </Button>
        <Button
          onClick={generateCSV}
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Generating...' : 'Generate CSV Report'}
        </Button>
      </div>
    </div>
  );
} 