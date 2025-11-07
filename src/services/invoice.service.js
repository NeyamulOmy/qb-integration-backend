const axios = require("axios");
const { prisma } = require("../db/prisma");
const { apiBase, getValidToken } = require("./qbo.service");

// Creates locally; syncs to QBO; returns saved/updated record
async function createInvoice(input) {
  const { clientName, email, dueDate, amount, status = "Draft", description, syncToQBO = true } = input;

  const created = await prisma.invoice.create({
    data: {
      clientName,
      email,
      dueDate: new Date(dueDate),
      amount: Number(amount),
      status,
      description,
    },
  });

  if (syncToQBO) {
    const oauth = await getValidToken();
    if (oauth?.accessToken && oauth?.realmId) {
      try {
        const payload = {
          Line: [
            {
              Amount: Number(amount),
              DetailType: "SalesItemLineDetail",
              SalesItemLineDetail: { ItemRef: { value: "1", name: "Service" } },
            },
          ],
          CustomerRef: { value: "1" }, // TODO: proper customer mapping later
          BillEmail: { Address: email },
          DueDate: new Date(dueDate).toISOString().slice(0, 10),
        };

        const { data } = await axios.post(
          `${apiBase(oauth.realmId)}/invoice?minorversion=75`,
          payload,
          { headers: { Authorization: `Bearer ${oauth.accessToken}`, Accept: "application/json" } }
        );

        const qboId = data?.Invoice?.Id;
        if (qboId) {
          return prisma.invoice.update({ where: { id: created.id }, data: { qboInvoiceId: qboId } });
        }
      } catch (err) {
        
      }
    }
  }

  return created;
}

async function listInvoices() {
  return prisma.invoice.findMany({ orderBy: { createdAt: "desc" } });
}

module.exports = { createInvoice, listInvoices };
