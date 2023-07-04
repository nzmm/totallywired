using System;
using System.Linq;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using MockQueryable.Moq;
using Moq;
using NUnit.Framework;
using TotallyWired.Contracts;
using TotallyWired.Domain.Entities;
using TotallyWired.Infrastructure.EntityFramework;

namespace TotallyWired.Tests;

public abstract class BaseTestFixture
{
    protected static readonly User CurrentUser = new()
    {
        Id = Guid.NewGuid(),
        Name = "Current User",
        UserName = "cu",
        IdentityId = Guid.NewGuid().ToString()
    };

    protected Mock<TotallyWiredDbContext> MockDbContext = default!;
    protected Mock<DatabaseFacade> MockDbFacade = default!;
    protected Mock<ICurrentUser> MockCurrentUser = default!;
    
    /// <remark>
    /// https://github.com/romantitov/MockQueryable is used for mocking EntityFramework DbSets
    /// </remark>
    [SetUp]
    protected virtual void Setup()
    {
        var options = new DbContextOptions<TotallyWiredDbContext>();
        var mockContext = new Mock<TotallyWiredDbContext>(options);

        MockDbContext = mockContext;
        MockDbFacade = new Mock<DatabaseFacade>(mockContext.Object);
        MockCurrentUser = new Mock<ICurrentUser>();
        
        MockDbFacade
            .Setup(x => x.BeginTransactionAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(Mock.Of<IDbContextTransaction>());

        MockDbContext
            .Setup(x => x.Artists)
            .Returns(Enumerable.Empty<Artist>().AsQueryable().BuildMockDbSet().Object);
        
        MockDbContext
            .Setup(x => x.Releases)
            .Returns(Enumerable.Empty<Release>().AsQueryable().BuildMockDbSet().Object);
        
        
        MockDbContext
            .Setup(x => x.Tracks)
            .Returns(Enumerable.Empty<Track>().AsQueryable().BuildMockDbSet().Object);

        MockDbContext
            .Setup(x => x.TrackReactions)
            .Returns(Enumerable.Empty<TrackReaction>().AsQueryable().BuildMockDbSet().Object);

        MockDbContext
            .Setup(x => x.Users)
            .Returns(Enumerable.Empty<User>().AsQueryable().BuildMockDbSet().Object);

        MockDbContext
            .Setup(x => x.Sources)
            .Returns(Enumerable.Empty<Source>().AsQueryable().BuildMockDbSet().Object);
        
        MockDbContext
            .Setup(x => x.Database)
            .Returns(MockDbFacade.Object);

        MockCurrentUser
            .Setup(x => x.UserId())
            .Returns(Guid.NewGuid());
    }
}