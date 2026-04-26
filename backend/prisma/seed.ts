import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.approval.deleteMany();
  await prisma.workLog.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Existing data cleared');

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@worklog.pro',
      password: await hashPassword('Admin@123'),
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const pm1 = await prisma.user.create({
    data: {
      email: 'pm1@worklog.pro',
      password: await hashPassword('PM@123'),
      firstName: 'John',
      lastName: 'Manager',
      role: 'PM',
      isActive: true,
    },
  });

  const pm2 = await prisma.user.create({
    data: {
      email: 'pm2@worklog.pro',
      password: await hashPassword('PM@123'),
      firstName: 'Sarah',
      lastName: 'Lead',
      role: 'PM',
      isActive: true,
    },
  });

  const teamMembers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'dev1@worklog.pro',
        password: await hashPassword('Dev@123'),
        firstName: 'Alex',
        lastName: 'Developer',
        role: 'TEAM_MEMBER',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'dev2@worklog.pro',
        password: await hashPassword('Dev@123'),
        firstName: 'Emma',
        lastName: 'Engineer',
        role: 'TEAM_MEMBER',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'qa1@worklog.pro',
        password: await hashPassword('QA@123'),
        firstName: 'Mike',
        lastName: 'QA',
        role: 'TEAM_MEMBER',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'qa2@worklog.pro',
        password: await hashPassword('QA@123'),
        firstName: 'Lisa',
        lastName: 'Tester',
        role: 'TEAM_MEMBER',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'analyst@worklog.pro',
        password: await hashPassword('Data@123'),
        firstName: 'Chris',
        lastName: 'Analyst',
        role: 'TEAM_MEMBER',
        isActive: true,
      },
    }),
  ]);

  console.log('✓ Created 8 users (1 Admin, 2 PMs, 5 Team Members)');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete redesign of the company website',
      status: 'ACTIVE',
      client: 'Internal',
      budget: 50000,
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      createdById: pm1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'iOS and Android mobile app',
      status: 'ACTIVE',
      client: 'TechCorp Inc',
      budget: 80000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-08-31'),
      createdById: pm2.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Data Migration',
      description: 'Migrate legacy data to new platform',
      status: 'ACTIVE',
      client: 'Internal',
      budget: 30000,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-31'),
      createdById: admin.id,
    },
  });

  console.log('✓ Created 3 projects');

  // Add project members
  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: pm1.id, role: 'PM' },
      { projectId: project1.id, userId: teamMembers[0].id, role: 'MEMBER' },
      { projectId: project1.id, userId: teamMembers[1].id, role: 'MEMBER' },
      { projectId: project2.id, userId: pm2.id, role: 'PM' },
      { projectId: project2.id, userId: teamMembers[0].id, role: 'MEMBER' },
      { projectId: project2.id, userId: teamMembers[2].id, role: 'MEMBER' },
      { projectId: project2.id, userId: teamMembers[3].id, role: 'MEMBER' },
      { projectId: project3.id, userId: admin.id, role: 'PM' },
      { projectId: project3.id, userId: teamMembers[4].id, role: 'MEMBER' },
      { projectId: project3.id, userId: teamMembers[1].id, role: 'MEMBER' },
    ],
  });

  console.log('✓ Added project members');

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Design homepage mockups',
      description: 'Create high-fidelity mockups for the new homepage',
      status: 'COMPLETED',
      priority: 'HIGH',
      estimatedHours: 16,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      projectId: project1.id,
      title: 'Frontend development',
      description: 'Develop the website frontend',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      estimatedHours: 80,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'API integration',
      description: 'Integrate with backend API',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      estimatedHours: 40,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      projectId: project2.id,
      title: 'Mobile UI testing',
      description: 'QA testing for mobile app',
      status: 'TODO',
      priority: 'MEDIUM',
      estimatedHours: 30,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      projectId: project3.id,
      title: 'Data validation',
      description: 'Validate migrated data',
      status: 'IN_PROGRESS',
      priority: 'URGENT',
      estimatedHours: 50,
    },
  });

  console.log('✓ Created 5 tasks');

  // Create work logs (past week + today)
  const today = new Date();
  const workLogs = [];

  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Team member 1 - Developer
    workLogs.push({
      userId: teamMembers[0].id,
      projectId: project1.id,
      taskId: task2.id,
      date,
      hours: 8,
      description: 'Worked on frontend components',
      billable: true,
      tags: ['frontend', 'development'],
      status: 'APPROVED' as const,
    });

    // Team member 2 - Developer
    workLogs.push({
      userId: teamMembers[1].id,
      projectId: project1.id,
      taskId: task2.id,
      date,
      hours: 7,
      description: 'Code review and bug fixes',
      billable: true,
      tags: ['code-review', 'bugfix'],
      status: 'APPROVED' as const,
    });

    // Team member 3 - QA
    workLogs.push({
      userId: teamMembers[2].id,
      projectId: project2.id,
      taskId: task4.id,
      date,
      hours: 6,
      description: 'Testing API integration',
      billable: true,
      tags: ['testing', 'qa'],
      status: 'APPROVED' as const,
    });

    // Team member 4 - QA
    workLogs.push({
      userId: teamMembers[3].id,
      projectId: project2.id,
      taskId: task3.id,
      date,
      hours: 5,
      description: 'Bug reporting and documentation',
      billable: true,
      tags: ['qa', 'documentation'],
      status: i < 2 ? 'SUBMITTED' : 'APPROVED', // Recent ones not yet approved
    });

    // Team member 5 - Analyst
    workLogs.push({
      userId: teamMembers[4].id,
      projectId: project3.id,
      taskId: task5.id,
      date,
      hours: 4,
      description: 'Data validation and cleanup',
      billable: true,
      tags: ['data', 'validation'],
      status: 'APPROVED' as const,
    });
  }

  const createdWorkLogs = await prisma.workLog.createMany({
    data: workLogs as any,
  });

  console.log(`✓ Created ${createdWorkLogs.count} work logs`);

  // Create approvals for submitted work logs
  const submittedLogs = await prisma.workLog.findMany({
    where: { status: 'SUBMITTED' },
  });

  const approvals = await prisma.approval.createMany({
    data: submittedLogs.map((log) => ({
      worklogId: log.id,
      reviewedById: pm1.id,
      status: 'PENDING' as const,
    })),
  });

  console.log(`✓ Created ${approvals.count} approvals`);

  // Create some notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: pm1.id,
        type: 'PENDING_APPROVAL',
        title: 'New worklogs pending approval',
        content: 'You have 2 worklogs waiting for approval',
        isRead: false,
      },
      {
        userId: teamMembers[0].id,
        type: 'WORKLOG_APPROVED',
        title: 'Worklog approved',
        content: 'Your worklog for Website Redesign has been approved',
        isRead: true,
      },
    ],
  });

  console.log('✓ Created notifications');

  console.log('✅ Database seed completed successfully!');
  console.log('\n📝 Sample Credentials:');
  console.log('   Admin: admin@worklog.pro / Admin@123');
  console.log('   PM: pm1@worklog.pro / PM@123');
  console.log('   Developer: dev1@worklog.pro / Dev@123');
  console.log('   QA: qa1@worklog.pro / QA@123');
}

main()
  .catch((e) => {
    console.error('🚨 Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
