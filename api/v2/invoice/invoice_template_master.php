<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
	<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Expires" content="0" />
	<title>Woolston Web Design CRM</title>
    <style>
    </style>
</head>
<body>
    <table>
        <colgroup>
            <col style="width: 80%">
            <col style="width: 20%; text-align: right;"/>
        </colgroup>
        <tr>
            <td>
                <h1>Woolston Web Design</h1>
                <table>
                    <tr>
                        <td style="width: 20px;">P:</td>
                        <td>+61 407 077 508</td>
                    </tr>
                    <tr>
                        <td style="width: 20px;">E:</td>
                        <td>accounts@woolston.com.au</td>
                    </tr>
                    <tr>
                        <td style="width: 20px;">W:</td>
                        <td>https://www.woolston.com.au</td>
                    </tr>
                </table>
            </td>
            <td id="logo-cell">
                &nbsp;
            </td>
        </tr>
    </table>

    <table style="margin-top: 50px;">
        <colgroup>
            <col style="width: 60%">
            <col style="width: 40%; text-align: right;"/>
        </colgroup>
        <tr>
            <td>
                <h1>INVOICE <?php echo $InvoiceNumber; ?></h1>
            </td>
            <td class="alignright">Invoice Date:&nbsp;<?php echo $InvoiceDate; ?></td>
        </tr>
        <tr>
            <td><?php echo $CustomerName; ?></td>
            <td class="alignright">Due Date:&nbsp;<?php echo $InvoiceDueDate; ?></td>
        </tr>
        <tr>
            <td><?php echo $CustomerAddress; ?></td>
            <td class="alignright">BSB:&nbsp;064467 (CBA)</td>
        </tr>
        <tr>
            <td><?php echo $CustomerSuburb; ?> &nbsp; <?php echo $CustomerState; ?> &nbsp; <?php echo $CustomerPostcode; ?></td>
            <td class="alignright">A/c Number:&nbsp;10472252</td>
        </tr>
    </table>

    <table class="items-list" style="margin-top: 50px; border: 1px solid #ccc;"
        cellpadding="0" cellspacing="0">
        <colgroup>
            <col style="">
            <col style=" text-align: right;"/>
        </colgroup>
        <tr>
            <td style="background-color: #eee;"><strong>Description of Work</strong></td>
            <td style="background-color: #eee; border-left: 1px solid #ccc;" class="alignright"><strong>Cost</strong></td>
        </tr>
<?php
    $totalInvoiceCost = 0;
    foreach($invoice_items as $item):
        $totalInvoiceCost += $item["Cost"];
?>
        <tr>
            <td style="width: 80%; border-bottom: 1px solid #ccc;"><?php echo $item['Description']; ?></td>
            <td style="width: 20%; border-left: 1px solid #ccc; border-bottom: 1px solid #ccc;" class="alignright">$<?php echo number_format($item['Cost'], 2); ?></td>
        </tr>
<?php
    endforeach;
?>
        <tr>
            <td style="background-color: #eee;"><strong>Total</strong></td>
            <td style="background-color: #eee; border-left: 1px solid #ccc;" class="alignright"><strong>$<?php echo number_format($totalInvoiceCost, 2); ?></strong></td>
        </tr>
    </table>

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
            <td><?php echo $InvoiceCost; ?></td>
        </tr>
        <tr>
            <td>&nbsp;</td>
            <td><?php echo $CustomerSuburb; ?>&nbsp;<?php echo $CustomerState; ?>&nbsp;<?php echo $CustomerPostcode; ?></td>
            <td>Due Date:</td>
            <td><?php echo $InvoiceDueDate; ?></td>
        </tr>
        <tr>
            <td>ABN:</td>
            <td>90 402 082 387</td>
            <td>Invoice No:</td>
            <td><?php echo $InvoiceNumber; ?></td>
        </tr>
    </table>
</body>
</html>