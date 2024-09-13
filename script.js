$(document).ready(function() {
    const transactionsPerPage = 20;
    let transactions = [];
    let filteredTransactions = [];
    let currentPage = 1;

    // Load CSV file
    Papa.parse('data.csv', {
        download: true,
        header: true,
        complete: function(results) {
            transactions = results.data;
            filteredTransactions = transactions;
            displayTransactions();
            setupPagination();
        },
        error: function(error) {
            console.error("Error loading CSV file:", error);
        }
    });

    // Display transactions in the table
    function displayTransactions() {
        const start = (currentPage - 1) * transactionsPerPage;
        const end = start + transactionsPerPage;
        const paginatedTransactions = filteredTransactions.slice(start, end);

        $('#transactionTable').empty();
        paginatedTransactions.forEach(transaction => {
            $('#transactionTable').append(`
                <tr>
                    <td>${transaction.STT}</td>
                    <td>${transaction['Thoi gian']}</td>
                    <td>${transaction['Noi dung']}</td>
                    <td>${transaction['So tien']}</td>
                    <td>${transaction.Ten}</td>
                </tr>
            `);
        });
    }

    // Setup pagination controls
    function setupPagination() {
        const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
        const maxPagesToShow = 5;
        const halfPagesToShow = Math.floor(maxPagesToShow / 2);
        let startPage = Math.max(1, currentPage - halfPagesToShow);
        let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

        if (currentPage <= halfPagesToShow) {
            endPage = Math.min(totalPages, maxPagesToShow);
        }

        if (currentPage + halfPagesToShow >= totalPages) {
            startPage = Math.max(1, totalPages - maxPagesToShow + 1);
        }

        $('.pagination').empty();
        if (currentPage > 1) {
            $('.pagination').append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">First</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                </li>
            `);
        }

        for (let i = startPage; i <= endPage; i++) {
            $('.pagination').append(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        if (currentPage < totalPages) {
            $('.pagination').append(`
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">Last</a>
                </li>
            `);
        }

        $('.page-link').click(function(e) {
            e.preventDefault();
            currentPage = parseInt($(this).data('page'));
            displayTransactions();
            setupPagination();
        });
    }

    // Search functionality
    $('#searchButton').click(function() {
        const keyword = $('#search').val().toLowerCase();
        filteredTransactions = transactions.filter(transaction => {
            const noiDung = transaction['Noi dung'] ? transaction['Noi dung'].toLowerCase() : '';
            return noiDung.includes(keyword);
        });
        currentPage = 1;
        displayTransactions();
        setupPagination();
    });

    // Clear search functionality
    $('#clearButton').click(function() {
        $('#search').val('');
        filteredTransactions = transactions;
        currentPage = 1;
        displayTransactions();
        setupPagination();
    });
});