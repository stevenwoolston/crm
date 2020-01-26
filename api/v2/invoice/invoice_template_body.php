    <table>
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
            <td style="width: 20%; text-align: right">
                <img style="height: 100px; width: auto;" src="../assets/img/logo.png" alt="" >
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
            <td class="alignright">Invoice Date:&nbsp;<?php echo date_format(date_create($InvoiceDate), 'd-M-Y'); ?></td>
        </tr>
        <tr>
            <td><?php echo $CustomerName; ?></td>
            <td class="alignright">Due Date:&nbsp;<?php echo date_format(date_create($InvoiceDueDate), 'd-M-Y'); ?></td>
        </tr>
        <tr>
            <td><?php echo $CustomerAddress; ?></td>
            <td class="alignright">BSB:&nbsp;064467 (CBA)</td>
        </tr>
        <tr>
            <td><?php echo $CustomerSuburb; ?>&nbsp;<?php echo $CustomerState; ?>&nbsp;<?php echo $CustomerPostcode; ?></td>
            <td class="alignright">A/c Number:&nbsp;10472252</td>
        </tr>
    </table>

    <table class="items-list" style="margin-top: 50px; border: 1px solid #ccc;"
        cellpadding="0" cellspacing="0">
        <colgroup>
            <col style="">
            <col style="text-align: right;"/>
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
            <td style="width: 85%; border-bottom: 1px solid #ccc;"><?php echo $item['Description']; ?></td>
            <td style="width: 15%; border-left: 1px solid #ccc; border-bottom: 1px solid #ccc;" class="alignright">$<?php echo number_format($item['Cost'], 2); ?></td>
        </tr>
<?php
    endforeach;
?>
        <tr>
            <td style="background-color: #eee;"><strong>Total</strong></td>
            <td style="background-color: #eee; border-left: 1px solid #ccc;" class="alignright"><strong>$<?php echo number_format($totalInvoiceCost, 2); ?></strong></td>
        </tr>
    </table>
