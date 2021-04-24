
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
            <td style="width: 85%; border-bottom: 1px solid #ccc;"><?php echo htmlspecialchars_decode($item['Description']); ?></td>
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


<?php
    if (count($invoice_notes) > 0): ?>
    <h2 style="margin-top: 40px; font-weight: 700;">Notes related to this invoice</h2>
<?php
        foreach($invoice_notes as $item):
?>
    <div>
        <div style="width: 100%; font-weight: 700; font-size: 80%; border-bottom: 1px solid #ccc">
            <?php echo date_format(date_create($item["CreatedDate"]), 'd-M-Y'); ?>:&nbsp;
            <?php echo htmlspecialchars_decode($item['Description']); ?>
        </div>
<?php   if ($item['Notes']):    ?>
        <div style="font-size: 70%; padding: 0 0 20px 0;">
            <?php echo htmlspecialchars_decode($item['Notes']); ?>
        </div>
<?php   endif;  ?>
    </div>
<?php
        endforeach;
    endif;  ?>