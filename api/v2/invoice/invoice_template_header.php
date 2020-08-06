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
                <img style="height: 25mm; width: auto;" src="../../assets/img/logo.png" alt="" >
            </td>
        </tr>
    </table>

    <table style="margin-top: 15px;">
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
