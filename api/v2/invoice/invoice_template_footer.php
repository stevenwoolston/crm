
    <table style="margin-top: 30px;">
    <tr>
        <td style="text-align: center">
            Please make cheques payable to Steven Woolston, although EFT payment is preferred. Invoicing is on 14 day terms
        </td>
    </tr>
    </table>

    <table class="payment-advice" style="margin-top: 30px; background-color: #eee; border: 1px solid #ccc;">
        <tr>
            <td colspan="4">
                <h2>Payment Advice</h2>
            </td>
        </tr>
        <tr>
            <td style="width: 10%;">To</td>
            <td style="width: 35%;">Steven Woolston</td>
            <td style="width: 20%;">Customer</td>
            <td style="width: 35%;"><?php echo $CustomerName; ?></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td><?php echo $CustomerAddress; ?></td>
            <td>Amount Due:</td>
            <td>$<?php echo number_format($InvoiceCost, 2); ?></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td><?php echo $CustomerSuburb; ?>&nbsp;<?php echo $CustomerState; ?>&nbsp;<?php echo $CustomerPostcode; ?></td>
            <td>Due Date:</td>
            <td><?php echo date_format(date_create($InvoiceDueDate), 'd-M-Y'); ?></td>
        </tr>
        <tr>
            <td>ABN:</td>
            <td>90 402 082 387</td>
            <td>Invoice No:</td>
            <td><?php echo $InvoiceNumber; ?></td>
        </tr>
    </table>