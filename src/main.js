import './config.js'; // First load environment variables
import fs from 'fs';
import { createTicket } from './create-ticket.js';
import { getOrders } from './get-orders.js';
import { sendEmail } from './send-ticket.js';

const emailTemplate = fs.readFileSync('templates/email-template.txt', 'utf8');

const execute = async () => {
  const orders = await getOrders(); 
  for (const order of orders.data) {

    // Extract data from order
    const number = order.number;
    const name = order.billing.first_name + ' ' + order.billing.last_name;
    const email = order.billing.email;
    const now = new Date().toISOString();
    
    // Create a ticket (code) for each ordered product and save in ticket database
    const tickets = []
    for (const product of order.line_items) {
      if (product.name.toLowerCase().includes('dagkaart')) {
        for (let i=0; i < product.quantity; i++) {
          const code = await createTicket(number, name, email, "0", now);
          tickets.push({ code, type: 0 });
        }
      }
      if (product.name.toLowerCase().includes('weekkaart')) {
        for (let i=0; i < product.quantity; i++) {
          const code = await createTicket(number, name, email, "1", now);
          tickets.push({ code, type: 1 });
        }
      }
    }

    // Links
    const links = tickets.map(ticket => `https://www.jeugddorpleiden.nl/tickets/ticket/?code=${ticket.code} (${ticket.type === 0 ? 'dagkaart' : 'weekkaart'})`);

    // Email body
    const content = emailTemplate.replace('<links>', links.join('\n'));

    // Send email
    sendEmail(email, "Kaartjes Jeugddorp Leiden", content);

    console.log(number, name, email);
    console.log(links);
  }
};

execute();
