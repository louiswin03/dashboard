// ==================== PROFILES ====================
export const GET_PROFILE = `
  query GetProfile($userId: uuid!) {
    profiles_by_pk(id: $userId) {
      id
      first_name
      last_name
      company_name
      siret
      phone
      avatar_url
      created_at
      updated_at
    }
  }
`;

export const UPDATE_PROFILE = `
  mutation UpdateProfile($userId: uuid!, $data: profiles_set_input!) {
    update_profiles_by_pk(pk_columns: {id: $userId}, _set: $data) {
      id
      first_name
      last_name
      company_name
      siret
      phone
      avatar_url
      updated_at
    }
  }
`;

// ==================== TRANSACTIONS ====================
export const GET_TRANSACTIONS = `
  query GetTransactions($userId: uuid!, $limit: Int = 50, $offset: Int = 0) {
    transactions(
      where: {user_id: {_eq: $userId}}
      order_by: {date: desc}
      limit: $limit
      offset: $offset
    ) {
      id
      type
      amount
      category
      source
      merchant
      description
      date
      is_recurring
      is_deductible
      created_at
    }
  }
`;

export const GET_REVENUES = `
  query GetRevenues($userId: uuid!, $limit: Int = 50) {
    transactions(
      where: {user_id: {_eq: $userId}, type: {_eq: "revenue"}}
      order_by: {date: desc}
      limit: $limit
    ) {
      id
      amount
      category
      source
      description
      date
      is_recurring
      created_at
    }
  }
`;

export const GET_EXPENSES = `
  query GetExpenses($userId: uuid!, $limit: Int = 50) {
    transactions(
      where: {user_id: {_eq: $userId}, type: {_eq: "expense"}}
      order_by: {date: desc}
      limit: $limit
    ) {
      id
      amount
      category
      merchant
      description
      date
      is_recurring
      is_deductible
      created_at
    }
  }
`;

export const INSERT_TRANSACTION = `
  mutation InsertTransaction($data: transactions_insert_input!) {
    insert_transactions_one(object: $data) {
      id
      type
      amount
      category
      source
      merchant
      description
      date
      is_recurring
      is_deductible
      created_at
    }
  }
`;

export const DELETE_TRANSACTION = `
  mutation DeleteTransaction($id: uuid!) {
    delete_transactions_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== INVESTMENTS ====================
export const GET_INVESTMENTS = `
  query GetInvestments($userId: uuid!) {
    investments(
      where: {user_id: {_eq: $userId}}
      order_by: {created_at: desc}
    ) {
      id
      name
      symbol
      type
      quantity
      buy_price
      current_price
      purchase_date
      created_at
    }
  }
`;

export const INSERT_INVESTMENT = `
  mutation InsertInvestment($data: investments_insert_input!) {
    insert_investments_one(object: $data) {
      id
      name
      symbol
      type
      quantity
      buy_price
      current_price
      purchase_date
      created_at
    }
  }
`;

export const UPDATE_INVESTMENT_PRICE = `
  mutation UpdateInvestmentPrice($id: uuid!, $currentPrice: numeric!) {
    update_investments_by_pk(
      pk_columns: {id: $id}
      _set: {current_price: $currentPrice}
    ) {
      id
      current_price
    }
  }
`;

export const DELETE_INVESTMENT = `
  mutation DeleteInvestment($id: uuid!) {
    delete_investments_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== GOALS ====================
export const GET_GOALS = `
  query GetGoals($userId: uuid!) {
    goals(
      where: {user_id: {_eq: $userId}, status: {_neq: "archived"}}
      order_by: {created_at: desc}
    ) {
      id
      title
      target_amount
      current_amount
      category
      deadline
      status
      created_at
    }
  }
`;

export const INSERT_GOAL = `
  mutation InsertGoal($data: goals_insert_input!) {
    insert_goals_one(object: $data) {
      id
      title
      target_amount
      current_amount
      category
      deadline
      status
      created_at
    }
  }
`;

export const UPDATE_GOAL_PROGRESS = `
  mutation UpdateGoalProgress($id: uuid!, $currentAmount: numeric!) {
    update_goals_by_pk(
      pk_columns: {id: $id}
      _set: {current_amount: $currentAmount}
    ) {
      id
      current_amount
    }
  }
`;

export const DELETE_GOAL = `
  mutation DeleteGoal($id: uuid!) {
    delete_goals_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== PROJECTS ====================
export const GET_PROJECTS = `
  query GetProjects($userId: uuid!) {
    projects(
      where: {user_id: {_eq: $userId}}
      order_by: {created_at: desc}
    ) {
      id
      title
      description
      status
      priority
      progress
      due_date
      created_at
      updated_at
      tasks {
        id
        title
        is_completed
        due_date
        created_at
      }
    }
  }
`;

export const INSERT_PROJECT = `
  mutation InsertProject($data: projects_insert_input!) {
    insert_projects_one(object: $data) {
      id
      title
      description
      status
      priority
      progress
      due_date
      created_at
      updated_at
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject($id: uuid!, $data: projects_set_input!) {
    update_projects_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
      title
      description
      status
      priority
      progress
      due_date
      updated_at
    }
  }
`;

export const DELETE_PROJECT = `
  mutation DeleteProject($id: uuid!) {
    delete_projects_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== TASKS ====================
export const INSERT_TASK = `
  mutation InsertTask($data: tasks_insert_input!) {
    insert_tasks_one(object: $data) {
      id
      title
      is_completed
      due_date
      created_at
    }
  }
`;

export const UPDATE_TASK = `
  mutation UpdateTask($id: uuid!, $data: tasks_set_input!) {
    update_tasks_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
      title
      is_completed
      due_date
    }
  }
`;

export const DELETE_TASK = `
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== EVENTS ====================
export const GET_EVENTS = `
  query GetEvents($userId: uuid!, $startDate: timestamptz, $endDate: timestamptz) {
    events(
      where: {
        user_id: {_eq: $userId}
        start_time: {_gte: $startDate, _lte: $endDate}
      }
      order_by: {start_time: asc}
    ) {
      id
      title
      description
      start_time
      end_time
      location
      type
      created_at
    }
  }
`;

export const INSERT_EVENT = `
  mutation InsertEvent($data: events_insert_input!) {
    insert_events_one(object: $data) {
      id
      title
      description
      start_time
      end_time
      location
      type
      created_at
    }
  }
`;

export const UPDATE_EVENT = `
  mutation UpdateEvent($id: uuid!, $data: events_set_input!) {
    update_events_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
      title
      description
      start_time
      end_time
      location
      type
    }
  }
`;

export const DELETE_EVENT = `
  mutation DeleteEvent($id: uuid!) {
    delete_events_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== TAX OBLIGATIONS ====================
export const GET_TAX_OBLIGATIONS = `
  query GetTaxObligations($userId: uuid!) {
    tax_obligations(
      where: {user_id: {_eq: $userId}}
      order_by: {due_date: asc}
    ) {
      id
      title
      amount
      due_date
      status
      is_paid
      created_at
    }
  }
`;

export const INSERT_TAX_OBLIGATION = `
  mutation InsertTaxObligation($data: tax_obligations_insert_input!) {
    insert_tax_obligations_one(object: $data) {
      id
      title
      amount
      due_date
      status
      is_paid
      created_at
    }
  }
`;

export const UPDATE_TAX_OBLIGATION = `
  mutation UpdateTaxObligation($id: uuid!, $data: tax_obligations_set_input!) {
    update_tax_obligations_by_pk(pk_columns: {id: $id}, _set: $data) {
      id
      title
      amount
      due_date
      status
      is_paid
    }
  }
`;

export const DELETE_TAX_OBLIGATION = `
  mutation DeleteTaxObligation($id: uuid!) {
    delete_tax_obligations_by_pk(id: $id) {
      id
    }
  }
`;

// ==================== DASHBOARD STATS ====================
export const GET_DASHBOARD_STATS = `
  query GetDashboardStats($userId: uuid!, $startOfMonth: date!, $startOfLastMonth: date!) {
    currentMonthRevenues: transactions_aggregate(
      where: {
        user_id: {_eq: $userId}
        type: {_eq: "revenue"}
        date: {_gte: $startOfMonth}
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    lastMonthRevenues: transactions_aggregate(
      where: {
        user_id: {_eq: $userId}
        type: {_eq: "revenue"}
        date: {_gte: $startOfLastMonth, _lt: $startOfMonth}
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    currentMonthExpenses: transactions_aggregate(
      where: {
        user_id: {_eq: $userId}
        type: {_eq: "expense"}
        date: {_gte: $startOfMonth}
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    lastMonthExpenses: transactions_aggregate(
      where: {
        user_id: {_eq: $userId}
        type: {_eq: "expense"}
        date: {_gte: $startOfLastMonth, _lt: $startOfMonth}
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }

    investments(where: {user_id: {_eq: $userId}}) {
      buy_price
      current_price
      quantity
    }
  }
`;
